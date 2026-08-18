const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const crypto = require("crypto");
const axios = require("axios");

admin.initializeApp();

const CYBS_MERCHANT_ID   = defineSecret("CYBS_MERCHANT_ID");
const CYBS_KEY_ID        = defineSecret("CYBS_KEY_ID");
const CYBS_SHARED_SECRET = defineSecret("CYBS_SHARED_SECRET");

const CYBS_HOST = "apitest.cybersource.com";

async function cybsRequest({ method, resource, bodyObj, merchantId, keyId, sharedSecret }) {
  const date = new Date().toUTCString();
  const bodyString = bodyObj ? JSON.stringify(bodyObj) : "";

  const digest = "SHA-256=" + crypto.createHash("sha256").update(bodyString, "utf8").digest("base64");

  const signingFields = ["host", "date", "(request-target)", "digest", "v-c-merchant-id"];
  const map = {
    "host": CYBS_HOST,
    "date": date,
    "(request-target)": `${method} ${resource}`,
    "digest": digest,
    "v-c-merchant-id": merchantId,
  };
  const signingString = signingFields.map(f => `${f}: ${map[f]}`).join("\n");

  const signature = crypto
    .createHmac("sha256", Buffer.from(sharedSecret, "base64"))
    .update(signingString, "utf8")
    .digest("base64");

  const signatureHeader =
    `keyid="${keyId}", algorithm="HmacSHA256", ` +
    `headers="${signingFields.join(" ")}", signature="${signature}"`;

  const headers = {
    "v-c-merchant-id": merchantId,
    "Date": date,
    "Host": CYBS_HOST,
    "Digest": digest,
    "Signature": signatureHeader,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  return axios({
    method,
    url: `https://${CYBS_HOST}${resource}`,
    headers,
    data: bodyString,
    transformRequest: [(d) => d],
  });
}

// Function 1: capture context for Unified Checkout
exports.createCaptureContext = onRequest(
  { secrets: [CYBS_MERCHANT_ID, CYBS_KEY_ID, CYBS_SHARED_SECRET], cors: true },
  async (req, res) => {
    try {
      const r = await cybsRequest({
        method: "post",
        resource: "/up/v1/capture-contexts",
        bodyObj: {
          clientVersion: "0.24",
          targetOrigins: ["https://tam-app-2674c.web.app"],
          allowedCardNetworks: ["VISA", "MASTERCARD"],
          allowedPaymentTypes: ["PANENTRY"],
          country: "BW",
          locale: "en_US",
          captureMandate: {
            billingType: "NONE",
            requestEmail: false,
            requestPhone: false,
            requestShipping: false,
            showAcceptedNetworkIcons: true,
          },
          orderInformation: {
            amountDetails: { totalAmount: req.body?.amount || "1.00", currency: "BWP" },
          },
        },
        merchantId: CYBS_MERCHANT_ID.value(),
        keyId: CYBS_KEY_ID.value(),
        sharedSecret: CYBS_SHARED_SECRET.value(),
      });
      res.set("Content-Type", "text/plain").status(200).send(r.data);
    } catch (err) {
      logger.error("createCaptureContext failed", { status: err.response?.status, data: err.response?.data, message: err.message });
      res.status(500).json({ error: "capture_context_failed", status: err.response?.status, detail: err.response?.data || err.message });
    }
  }
);

// Function 2: confirm payment
exports.confirmPayment = onRequest(
  { secrets: [CYBS_MERCHANT_ID, CYBS_KEY_ID, CYBS_SHARED_SECRET], cors: true },
  async (req, res) => {
    try {
      const { transientToken, orderId, amount } = req.body || {};
      logger.info("confirmPayment received", {
        hasToken: !!transientToken,
        tokenType: typeof transientToken,
        tokenLength: transientToken ? String(transientToken).length : 0,
        tokenPreview: transientToken ? String(transientToken).slice(0, 40) : "NONE",
        orderId, amount,
      });
      if (!transientToken || !orderId) { res.status(400).json({ error: "missing_params" }); return; }

      const r = await cybsRequest({
        method: "post",
        resource: "/pts/v2/payments",
        bodyObj: {
          clientReferenceInformation: { code: orderId },
          processingInformation: { capture: true, commerceIndicator: "internet" },
          orderInformation: { amountDetails: { totalAmount: String(amount || "1.00"), currency: "BWP" } },
          tokenInformation: { transientTokenJwt: transientToken },
        },
        merchantId: CYBS_MERCHANT_ID.value(),
        keyId: CYBS_KEY_ID.value(),
        sharedSecret: CYBS_SHARED_SECRET.value(),
      });

      const status = r.data?.status;
      const paid = status === "AUTHORIZED" || status === "PENDING";
      if (paid) {
        await admin.database().ref(`orders/${orderId}`).update({
          paid: true, paymentStatus: status, cybsTransactionId: r.data?.id || null, paidAt: Date.now(),
        });
      }
      res.status(200).json({ ok: true, status, paid, id: r.data?.id });
    } catch (err) {
      logger.error("confirmPayment failed FULL", {
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
        message: err.message,
      });
      res.status(500).json({ error: "confirm_failed", status: err.response?.status, detail: err.response?.data || err.message });
    }
  }
);
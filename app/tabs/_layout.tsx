import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { View, Text, StyleSheet } from 'react-native';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.pink,
        tabBarInactiveTintColor: Colors.grey,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🍽️" label="Menu" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🛒" label="Cart" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Orders" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem:     { alignItems: 'center', justifyContent: 'center', paddingTop: 6 },
  emoji:       { fontSize: 20 },
  label:       { fontSize: 10, color: Colors.grey, marginTop: 2 },
  labelActive: { color: Colors.pink, fontWeight: '600' },
});
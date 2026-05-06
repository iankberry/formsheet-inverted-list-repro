import { DarkTheme, DefaultTheme, NavigationContainer, useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useColorScheme, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

type RootStackParamList = {
  Home: undefined;
  Sheet: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const ITEMS = Array.from({ length: 50 }, (_, index) => `Item ${index + 1}`);

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  const theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#2563eb',
      background: isDark ? '#000000' : '#ffffff',
      card: isDark ? '#1f2937' : '#f3f4f6',
      text: isDark ? '#ffffff' : '#111827',
      border: isDark ? '#374151' : '#d1d5db',
    },
  };

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Form Sheet Repro' }} />
            <Stack.Screen
              name="Sheet"
              component={SheetScreen}
              options={{
                title: 'Inverted FlatList',
                presentation: 'formSheet',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.homeContent}>
        <Text style={[styles.title, { color: colors.text }]}>Form Sheet Repro</Text>
        <Text style={[styles.description, { color: colors.text }]}>Opens a React Navigation form sheet with an inverted FlatList.</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Sheet')}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.card },
            pressed && styles.buttonPressed,
          ]}>
          <Text style={[styles.buttonText, { color: colors.text }]}>Open sheet</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function SheetScreen() {
  const { colors } = useTheme();
  const screen = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={[styles.screen, { backgroundColor: colors.background, height: screen.height - insets.top - headerHeight }]}>
      <FlatList
        data={ITEMS}
        inverted={true}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item}
        nestedScrollEnabled={true}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Text style={[styles.rowText, { color: colors.text }]}>{item}</Text>
          </View>
        )}
        ItemSeparatorComponent={Separator}
      />
    </SafeAreaView>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  homeContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    maxWidth: 320,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 320,
    opacity: 0.75,
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  row: {
    minHeight: 56,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowText: {
    fontSize: 16,
  },
  separator: {
    height: 8,
  },
});

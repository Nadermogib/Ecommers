import { Stack } from "expo-router";
import "../global.css"
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import * as Sentry from '@sentry/react-native';
import { StripeProvider } from "@stripe/stripe-react-native";

const queryCliet= new QueryClient()
export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>

    <QueryClientProvider client={queryCliet}>
      <StripeProvider publishableKey={process.env.EXPO_STRIPE_PUBLISHABLE_KEY!}>

      <Stack screenOptions={{headerShown:false}}/>
      </StripeProvider>
    </QueryClientProvider>

    </ClerkProvider>
  );


Sentry.init({
  dsn: 'https://f5ebd9a2d13190770c77d303eed86e00@o4510812401172480.ingest.us.sentry.io/4510812410413056',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
});
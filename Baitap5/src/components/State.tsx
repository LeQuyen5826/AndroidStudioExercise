import { ActivityIndicator, Button, Text, View } from "react-native";

export const Loading = () => (
  <View style={{ flex: 1, justifyContent: "center" }}>
    <ActivityIndicator size="large" />
  </View>
);
export const ErrorView = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      gap: 12,
    }}
  >
    <Text style={{ color: "crimson", textAlign: "center" }}>{message}</Text>
    <Button title="Thử lại" onPress={onRetry} />
  </View>
);
export const Empty = ({ text }: { text: string }) => (
  <Text style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
    {text}
  </Text>
);

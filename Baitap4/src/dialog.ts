import { Alert, Platform } from "react-native";

export function confirmDialog(
  title: string,
  message: string,
  yesText: string,
  noText: string,
  onYes: () => void,
) {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) onYes();
    return;
  }
  Alert.alert(title, message, [
    { text: noText, style: "cancel" },
    { text: yesText, onPress: onYes },
  ]);
}

export function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}

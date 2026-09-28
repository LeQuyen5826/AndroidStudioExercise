import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.phone}>
        <View style={styles.content}>
          <View style={[styles.box, styles.blue, { height: 70 }]}>
            <Text style={styles.text}>1</Text>
          </View>

          <View style={[styles.box, styles.red, { height: 70 }]}>
            <Text style={styles.text}>2</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.box, styles.small, styles.yellow]}>
              <Text style={styles.textDark}>3</Text>
            </View>
            <View style={[styles.box, styles.small, styles.green]}>
              <Text style={styles.text}>4</Text>
            </View>
            <View style={[styles.box, styles.small, styles.purple]}>
              <Text style={styles.text}>5</Text>
            </View>
          </View>

          <View style={[styles.box, styles.orange, { height: 122 }]}>
            <Text style={styles.text}>6</Text>
          </View>
        </View>

        <Text style={styles.footerText}>Lê Đình Đức Quyền - BIT240201</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  phone: {
    flex: 1,
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 6,
    gap: 6,
  },
  box: { justifyContent: "center", alignItems: "center" },
  row: { height: 146, flexDirection: "row", gap: 6 },
  small: { width: "24%", height: "100%" },
  blue: { backgroundColor: "#2f7bf0" },
  red: { backgroundColor: "#f0403f" },
  yellow: { backgroundColor: "#ffd21f" },
  green: { backgroundColor: "#31a05a" },
  purple: { backgroundColor: "#7b2fdb" },
  orange: { backgroundColor: "#f5820a" },
  text: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  textDark: { color: "#000", fontSize: 24, fontWeight: "bold" },
  footerText: {
    textAlign: "center",
    fontSize: 13,
    color: "#333",
    paddingBottom: 16,
  },
});

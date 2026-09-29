import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [showBaitap2, setShowBaitap2] = useState(false);
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");

  if (showBaitap2) {
    return (
      <SafeAreaView style={styles.baitap2Screen}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowBaitap2(false)}
          activeOpacity={0.6}
        >
          <Image
            source={require("../../assets/images/arrow.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.studentInfoDisplay}>
          <Text style={styles.baitap2Text}>Thông tin sinh viên</Text>
          <Text style={styles.infoText}>Full Name: {fullName || "—"}</Text>
          <Text style={styles.infoText}>Student ID: {studentId || "—"}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <View style={styles.studentInfo}>
          <Text style={styles.sectionTitle}>Nhập thông tin sinh viên</Text>
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Student ID"
            placeholderTextColor="#999"
            value={studentId}
            onChangeText={setStudentId}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowBaitap2(true)}
        >
          <Text style={styles.buttonText}>Click Me</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  baitap2Screen: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 14,
    padding: 8,
  },
  backIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  baitap2Text: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  studentInfoDisplay: { alignItems: "center", gap: 8 },
  infoText: { color: "#333", fontSize: 18 },
  studentInfo: { paddingHorizontal: 14, paddingBottom: 12, gap: 8 },
  sectionTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: "#000",
  },
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
  button: {
    alignSelf: "center",
    backgroundColor: "#2f7bf0",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  text: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  textDark: { color: "#000", fontSize: 24, fontWeight: "bold" },
});

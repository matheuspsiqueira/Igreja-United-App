import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    color: "#222",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  menu: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },

});

export default styles;

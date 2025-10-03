import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: "bold",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#32634cd2",
    borderRadius: 15,
    padding: 4,
  },
  usernameEmail: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },

  // Seções
  section: {
    marginTop: 25,
    borderRadius: 8,
    overflow: "hidden",
  },
  sectionTitle: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontWeight: "bold",
    fontSize: 16,
  },

  // Itens do menu
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 14,
    marginLeft: 10,
  },
  arrowIcon: {
    marginLeft: "auto",
  },

  // Toggle (modo escuro)
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  toggleText: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutItem: {
    marginBottom: 50,
  },
});

export default styles;

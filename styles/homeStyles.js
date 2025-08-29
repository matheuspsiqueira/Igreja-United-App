import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get("window");

export const homeStyles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: -1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  iconCard: {
    width: 90,
    height: 90,
    backgroundColor: '#a1dea61f',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  cardText: {
    marginTop: 10,
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionContent: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(161, 222, 166, 0.25)',
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    padding: 10,
  },
  textItem: {
    fontSize: 15,
    marginVertical: 4,
    color: '#ecf0f1',
    padding: 10,
    lineHeight: 20,
  },
  videoContainer: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
    padding: 4,
  },
  innerVideo: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },

  // 🔹 Estilos do Popup
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  popupContent: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "rgba(161, 222, 166, 0.25)",
    borderRadius: 20,
    padding: 15,
  },
  popupCloseBtn: {
    alignSelf: "flex-end",
  },
  popupCloseText: {
    color: "#fff",
    fontSize: 18,
  },
});

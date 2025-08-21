import { StyleSheet } from 'react-native';

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
    backgroundColor: 'rgba(0,0,0,0.4)', // deixa o conteúdo legível sobre o vídeo
    padding: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  iconCard: {
    width: 100,
    height: 100,
    backgroundColor: '#a1dea642',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionContent: {
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#a1dea642',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  textItem: {
    fontSize: 16,
    marginVertical: 5,
    color: '#ecf0f1',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  innerVideo: {
    width: '100%',
    height: '100%',
  },
});

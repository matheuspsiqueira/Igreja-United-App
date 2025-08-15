import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 20,
  },
  scroll: {
    padding: 15,
  },
  versaoPicker: {
    height: 50,
    width: 140,
    alignSelf: 'flex-start',
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 3,
  },
  folderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  folderText: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    color: '#333',
  },
  folderAntigo: {
    backgroundColor: '#A0522D', // marrom/terra
  },
  folderNovo: {
    backgroundColor: '#1E90FF', // azul
  },
  bookItem: {
    fontSize: 16,
    paddingVertical: 10,
    paddingLeft: 25,
    color: '#1E88E5',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCC',
  },
  chapterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chapterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    margin: 4,
    elevation: 2,
  },
  chapterButtonSelected: {
    backgroundColor: '#1E90FF',
  },
  chapterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  chapterTextSelected: {
    color: '#fff',
  },
  bibleText: {
    fontSize: 16,
    marginTop: 15,
    lineHeight: 26,
    color: '#212121',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontFamily: 'serif', // fonte serifada
  },
  selectedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E90FF',
    paddingBottom: 5,
  },
});

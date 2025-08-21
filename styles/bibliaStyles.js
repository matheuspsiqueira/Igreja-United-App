import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // fundo escuro
    paddingTop: 20,
  },
  scroll: {
    padding: 15,
    backgroundColor: '#121212',
  },
  versaoPicker: {
    height: 50,
    width: 140,
    alignSelf: 'flex-start',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    color: '#000000',
    fontWeight: '700',
  },
  folderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  folderTextAntigo: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    color: '#fff', // branco
  },
  folderTextNovo: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    color: '#fff', // preto
  },
  folderAntigo: {
    backgroundColor: '#c15123',
  },
  folderNovo: {
    backgroundColor: '#c15123',
  },
  bookItem: {
    fontSize: 16,
    paddingVertical: 10,
    paddingLeft: 25,
    color: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  chapterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chapterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2C2C2C',
    borderRadius: 6,
    margin: 4,
    elevation: 2,
  },
  chapterButtonSelected: {
    backgroundColor: '#c15123',
  },
  chapterText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  chapterTextSelected: {
    color: '#fff',
  },
  bibleText: {
    fontSize: 16,
    marginTop: 15,
    lineHeight: 26,
    color: '#fff',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontFamily: 'serif',
  },
  selectedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#c15123',
    paddingBottom: 5,
  },
  bibleTextContainer: {
    marginTop: 15,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  verseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  verseMarked: {
    backgroundColor: '#ce774a',
    color: '#000000',
  },
  verseNumber: {
    fontWeight: 'bold',
    marginRight: 6,
    color: '#c15123',
  },
  verseText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    color: '#fff',
    fontFamily: 'serif',
  },
});

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    paddingTop: 20,
  },
  versaoPicker: {
    height: 50,
    width: 120,
    alignSelf: 'flex-start',
    marginLeft: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    elevation: 2,
  },
  scroll: {
    padding: 10,
  },
  folderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  folderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  bookItem: {
    fontSize: 16,
    paddingVertical: 5,
    paddingLeft: 20,
    color: '#007BFF',
  },
  chapterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  chapterButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    margin: 4,
  },
  chapterText: {
    fontSize: 14,
    color: '#333',
  },
  bibleText: {
    fontSize: 16,
    marginTop: 10,
    lineHeight: 22,
    color: '#222',
  },
});

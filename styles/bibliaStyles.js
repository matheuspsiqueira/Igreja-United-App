import { StyleSheet } from 'react-native';

export const bibliaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  versionPicker: {
    height: 40,
    width: 120,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bookContainer: {
    marginLeft: 10,
    marginTop: 5,
  },
  bookText: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 5,
  },
  chapterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
  },
  chapterText: {
    margin: 2,
    padding: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
  },
});

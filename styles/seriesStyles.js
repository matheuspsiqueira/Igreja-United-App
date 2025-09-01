import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // fundo escuro
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff', // se quiser manter visível caso use header em algum lugar
    display: 'none', // oculta o título da página
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(161, 222, 166, 0.25)', // card escuro
  },
  capa: {
    width: '100%',
    height: 200,
  },
  titulo: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // texto do card visível no escuro
  },
  episodioCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#a1dea663', // card de episódio escuro
    borderRadius: 8,
  },
  episodioTitulo: {
    fontSize: 16,
    color: '#fff', // texto do episódio visível
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

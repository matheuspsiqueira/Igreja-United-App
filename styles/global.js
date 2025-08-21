import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#121212', // fundo escuro
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF', // título branco
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#E0E0E0', // cinza claro para leitura confortável
  },
});

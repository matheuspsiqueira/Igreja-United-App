import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/bibliaStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Biblia() {
  const [versao, setVersao] = useState('nvi');
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [capitulos, setCapitulos] = useState([]);
  const [capituloSelecionado, setCapituloSelecionado] = useState(null);
  const [textoBiblia, setTextoBiblia] = useState('');
  const [loading, setLoading] = useState(false);

  const [antigoAberto, setAntigoAberto] = useState(false);
  const [novoAberto, setNovoAberto] = useState(false);

  // Slug correto para API: minúsculas, sem espaços, sem traços, sem acentos
  const formatarSlug = (slug) => {
    return slug
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/-/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // --- Livros ---
  const livrosAntigo = [
    { nome: 'Gênesis', value: 'genesis', capitulos: 50 },
    { nome: 'Êxodo', value: 'exodo', capitulos: 40 },
    { nome: 'Levítico', value: 'levitico', capitulos: 27 },
    { nome: 'Números', value: 'numeros', capitulos: 36 },
    { nome: 'Deuteronômio', value: 'deuteronomio', capitulos: 34 },
    { nome: 'Josué', value: 'josue', capitulos: 24 },
    { nome: 'Juízes', value: 'juizes', capitulos: 21 },
    { nome: 'Rute', value: 'rute', capitulos: 4 },
    { nome: '1 Samuel', value: '1-samuel', capitulos: 31 },
    { nome: '2 Samuel', value: '2-samuel', capitulos: 24 },
    { nome: '1 Reis', value: '1-reis', capitulos: 22 },
    { nome: '2 Reis', value: '2-reis', capitulos: 25 },
    { nome: '1 Crônicas', value: '1-cronicas', capitulos: 29 },
    { nome: '2 Crônicas', value: '2-cronicas', capitulos: 36 },
    { nome: 'Esdras', value: 'esdras', capitulos: 10 },
    { nome: 'Neemias', value: 'neemias', capitulos: 13 },
    { nome: 'Ester', value: 'ester', capitulos: 10 },
    { nome: 'Jó', value: 'jo', capitulos: 42 },
    { nome: 'Salmos', value: 'salmos', capitulos: 150 },
    { nome: 'Provérbios', value: 'proverbios', capitulos: 31 },
    { nome: 'Eclesiastes', value: 'eclesiastes', capitulos: 12 },
    { nome: 'Cantares', value: 'cantares', capitulos: 8 },
    { nome: 'Isaías', value: 'isaias', capitulos: 66 },
    { nome: 'Jeremias', value: 'jeremias', capitulos: 52 },
    { nome: 'Lamentações', value: 'lamentacoes', capitulos: 5 },
    { nome: 'Ezequiel', value: 'ezequiel', capitulos: 48 },
    { nome: 'Daniel', value: 'daniel', capitulos: 12 },
    { nome: 'Oséias', value: 'oseias', capitulos: 14 },
    { nome: 'Joel', value: 'joel', capitulos: 3 },
    { nome: 'Amós', value: 'amos', capitulos: 9 },
    { nome: 'Obadias', value: 'obadias', capitulos: 1 },
    { nome: 'Jonas', value: 'jonas', capitulos: 4 },
    { nome: 'Miquéias', value: 'miqueias', capitulos: 7 },
    { nome: 'Naum', value: 'naum', capitulos: 3 },
    { nome: 'Habacuque', value: 'habacuque', capitulos: 3 },
    { nome: 'Sofonias', value: 'sofonias', capitulos: 3 },
    { nome: 'Ageu', value: 'ageu', capitulos: 2 },
    { nome: 'Zacarias', value: 'zacarias', capitulos: 14 },
    { nome: 'Malaquias', value: 'malaquias', capitulos: 4 },
  ];

  const livrosNovo = [
    { nome: 'Mateus', value: 'mateus', capitulos: 28 },
    { nome: 'Marcos', value: 'marcos', capitulos: 16 },
    { nome: 'Lucas', value: 'lucas', capitulos: 24 },
    { nome: 'João', value: 'joao', capitulos: 21 },
    { nome: 'Atos', value: 'atos', capitulos: 28 },
    { nome: 'Romanos', value: 'romanos', capitulos: 16 },
    { nome: '1 Coríntios', value: '1-corintios', capitulos: 16 },
    { nome: '2 Coríntios', value: '2-corintios', capitulos: 13 },
    { nome: 'Gálatas', value: 'galatas', capitulos: 6 },
    { nome: 'Efésios', value: 'efesios', capitulos: 6 },
    { nome: 'Filipenses', value: 'filipenses', capitulos: 4 },
    { nome: 'Colossenses', value: 'colossenses', capitulos: 4 },
    { nome: '1 Tessalonicenses', value: '1-tessalonicenses', capitulos: 5 },
    { nome: '2 Tessalonicenses', value: '2-tessalonicenses', capitulos: 3 },
    { nome: '1 Timóteo', value: '1-timoteo', capitulos: 6 },
    { nome: '2 Timóteo', value: '2-timoteo', capitulos: 4 },
    { nome: 'Tito', value: 'tito', capitulos: 3 },
    { nome: 'Filemom', value: 'filemom', capitulos: 1 },
    { nome: 'Hebreus', value: 'hebreus', capitulos: 13 },
    { nome: 'Tiago', value: 'tiago', capitulos: 5 },
    { nome: '1 Pedro', value: '1-pedro', capitulos: 5 },
    { nome: '2 Pedro', value: '2-pedro', capitulos: 3 },
    { nome: '1 João', value: '1-joao', capitulos: 5 },
    { nome: '2 João', value: '2-joao', capitulos: 1 },
    { nome: '3 João', value: '3-joao', capitulos: 1 },
    { nome: 'Judas', value: 'judas', capitulos: 1 },
    { nome: 'Apocalipse', value: 'apocalipse', capitulos: 22 },
  ];

  const selecionarLivro = (livro) => {
    setLivroSelecionado(livro);
    const caps = Array.from({ length: livro.capitulos }, (_, i) => i + 1);
    setCapitulos(caps);
    setTextoBiblia('');
  };

  const selecionarCapitulo = async (capitulo) => {
    if (!livroSelecionado) return;
    setCapituloSelecionado(capitulo);
    setLoading(true);

    try {
      const slugLivro = formatarSlug(livroSelecionado.value);
      const url = `https://bolls.life/get-chapter/${versao}/${slugLivro}/${capitulo}.json`;
      console.log('Buscando capítulo:', livroSelecionado.nome, capitulo);
      console.log('URL:', url);

      const response = await fetch(url);
      const data = await response.json();

      if (data?.verses && Array.isArray(data.verses)) {
        const texto = data.verses.map(v => `${v.verse}. ${v.text}`).join('\n\n');
        setTextoBiblia(texto);
      } else {
        console.warn('Resposta inesperada:', data);
        setTextoBiblia('Erro ao buscar capítulo.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setTextoBiblia('Erro ao buscar capítulo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Versão */}
      <Picker
        selectedValue={versao}
        style={styles.versaoPicker}
        onValueChange={(itemValue) => setVersao(itemValue)}
      >
        <Picker.Item label="NVI" value="nvi" />
        <Picker.Item label="NAA" value="naa" />
        <Picker.Item label="ACF" value="acf" />
      </Picker>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Antigo Testamento */}
        <TouchableOpacity style={styles.folderButton} onPress={() => setAntigoAberto(!antigoAberto)}>
          <Icon name={antigoAberto ? 'folder-open' : 'folder'} size={22} color="#333" />
          <Text style={styles.folderText}>Antigo Testamento</Text>
        </TouchableOpacity>
        {antigoAberto &&
          livrosAntigo.map((livro, idx) => (
            <TouchableOpacity key={idx} onPress={() => selecionarLivro(livro)}>
              <Text style={styles.bookItem}>{livro.nome}</Text>
            </TouchableOpacity>
          ))
        }

        {/* Novo Testamento */}
        <TouchableOpacity style={styles.folderButton} onPress={() => setNovoAberto(!novoAberto)}>
          <Icon name={novoAberto ? 'folder-open' : 'folder'} size={22} color="#333" />
          <Text style={styles.folderText}>Novo Testamento</Text>
        </TouchableOpacity>
        {novoAberto &&
          livrosNovo.map((livro, idx) => (
            <TouchableOpacity key={idx} onPress={() => selecionarLivro(livro)}>
              <Text style={styles.bookItem}>{livro.nome}</Text>
            </TouchableOpacity>
          ))
        }

        {/* Capítulos */}
        {capitulos.length > 0 && (
          <View style={styles.chapterContainer}>
            {capitulos.map((cap, idx) => (
              <TouchableOpacity key={idx} style={styles.chapterButton} onPress={() => selecionarCapitulo(cap)}>
                <Text style={styles.chapterText}>{cap}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Texto */}
        {loading && <ActivityIndicator size="large" color="#000" />}
        {textoBiblia !== '' && !loading && (
          <Text style={styles.bibleText}>{textoBiblia}</Text>
        )}
      </ScrollView>
    </View>
  );
}

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { bibliaStyles } from '../styles/bibliaStyles';

// Lista de livros
const livros = {
  "Antigo Testamento": [
    { name: 'Gênesis', value: 'genesis', chapters: 50 },
    { name: 'Êxodo', value: 'exodo', chapters: 40 },
    { name: 'Levítico', value: 'levitico', chapters: 27 },
    { name: 'Números', value: 'numeros', chapters: 36 },
    { name: 'Deuteronômio', value: 'deuteronomio', chapters: 34 },
    { name: 'Josué', value: 'josue', chapters: 24 },
    { name: 'Juízes', value: 'juizes', chapters: 21 },
    { name: 'Rute', value: 'rute', chapters: 4 },
    { name: '1 Samuel', value: '1-samuel', chapters: 31 },
    { name: '2 Samuel', value: '2-samuel', chapters: 24 },
    { name: '1 Reis', value: '1-reis', chapters: 22 },
    { name: '2 Reis', value: '2-reis', chapters: 25 },
    { name: '1 Crônicas', value: '1-cronicas', chapters: 29 },
    { name: '2 Crônicas', value: '2-cronicas', chapters: 36 },
    { name: 'Esdras', value: 'esdras', chapters: 10 },
    { name: 'Neemias', value: 'neemias', chapters: 13 },
    { name: 'Ester', value: 'ester', chapters: 10 },
    { name: 'Jó', value: 'jo', chapters: 42 },
    { name: 'Salmos', value: 'salmos', chapters: 150 },
    { name: 'Provérbios', value: 'provérbios', chapters: 31 },
    { name: 'Eclesiastes', value: 'eclesiastes', chapters: 12 },
    { name: 'Cânticos', value: 'canticos', chapters: 8 },
    { name: 'Isaías', value: 'isaias', chapters: 66 },
    { name: 'Jeremias', value: 'jeremias', chapters: 52 },
    { name: 'Lamentações', value: 'lamentacoes', chapters: 5 },
    { name: 'Ezequiel', value: 'ezequiel', chapters: 48 },
    { name: 'Daniel', value: 'daniel', chapters: 12 },
    { name: 'Oseias', value: 'oseias', chapters: 14 },
    { name: 'Joel', value: 'joel', chapters: 3 },
    { name: 'Amós', value: 'amos', chapters: 9 },
    { name: 'Obadias', value: 'obadias', chapters: 1 },
    { name: 'Jonas', value: 'jonas', chapters: 4 },
    { name: 'Miquéias', value: 'miqueias', chapters: 7 },
    { name: 'Naum', value: 'naum', chapters: 3 },
    { name: 'Habacuque', value: 'habacuque', chapters: 3 },
    { name: 'Sofonias', value: 'sofonias', chapters: 3 },
    { name: 'Ageu', value: 'ageu', chapters: 2 },
    { name: 'Zacarias', value: 'zacarias', chapters: 14 },
    { name: 'Malaquias', value: 'malaquias', chapters: 4 },
  ],
  "Novo Testamento": [
    { name: 'Mateus', value: 'mateus', chapters: 28 },
    { name: 'Marcos', value: 'marcos', chapters: 16 },
    { name: 'Lucas', value: 'lucas', chapters: 24 },
    { name: 'João', value: 'joao', chapters: 21 },
    { name: 'Atos', value: 'atos', chapters: 28 },
    { name: 'Romanos', value: 'romanos', chapters: 16 },
    { name: '1 Coríntios', value: '1-corintios', chapters: 16 },
    { name: '2 Coríntios', value: '2-corintios', chapters: 13 },
    { name: 'Gálatas', value: 'galatas', chapters: 6 },
    { name: 'Efésios', value: 'efesios', chapters: 6 },
    { name: 'Filipenses', value: 'filipenses', chapters: 4 },
    { name: 'Colossenses', value: 'colossenses', chapters: 4 },
    { name: '1 Tessalonicenses', value: '1-tessalonisenses', chapters: 5 },
    { name: '2 Tessalonicenses', value: '2-tessalonisenses', chapters: 3 },
    { name: '1 Timóteo', value: '1-timoteo', chapters: 6 },
    { name: '2 Timóteo', value: '2-timoteo', chapters: 4 },
    { name: 'Tito', value: 'tito', chapters: 3 },
    { name: 'Filemom', value: 'filemom', chapters: 1 },
    { name: 'Hebreus', value: 'hebreus', chapters: 13 },
    { name: 'Tiago', value: 'tiago', chapters: 5 },
    { name: '1 Pedro', value: '1-pedro', chapters: 5 },
    { name: '2 Pedro', value: '2-pedro', chapters: 3 },
    { name: '1 João', value: '1-joao', chapters: 5 },
    { name: '2 João', value: '2-joao', chapters: 1 },
    { name: '3 João', value: '3-joao', chapters: 1 },
    { name: 'Judas', value: 'judas', chapters: 1 },
    { name: 'Apocalipse', value: 'apocalipse', chapters: 22 },
  ]
};

export default function Biblia() {
  const [versao, setVersao] = useState('nvi');
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [capituloSelecionado, setCapituloSelecionado] = useState(null);
  const [textoBiblia, setTextoBiblia] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandAntigo, setExpandAntigo] = useState(false);
  const [expandNovo, setExpandNovo] = useState(false);

  const buscarCapitulo = async (livro, capitulo) => {
  setLoading(true);
  try {
    const url = `https://www.abibliadigital.com.br/api/verses/${versao}/${livro}/${capitulo}`;
    console.log('URL:', url); // <--- veja se está correta
    const response = await fetch(url);
    const data = await response.json();
    if (data.verses) {
      setTextoBiblia(data.verses.map(v => `${v.number}. ${v.text}`).join('\n\n'));
    } else if (data.error) {
      setTextoBiblia(`Erro: ${data.error}`);
    } else {
      setTextoBiblia('Erro ao buscar capítulo.');
    }
  } catch (error) {
    console.log('Erro fetch:', error);
    setTextoBiblia('Erro ao buscar capítulo.');
  } finally {
    setLoading(false);
  }
};

  const selecionarCapitulo = (livro, capitulo) => {
  console.log(`Buscando capítulo: Livro=${livro}, Capítulo=${capitulo}`);
  setLivroSelecionado(livro);
  setCapituloSelecionado(capitulo);
  buscarCapitulo(livro, capitulo);
};

  return (
    <View style={bibliaStyles.container}>
      {/* Seleção de versão */}
      <View style={bibliaStyles.topBar}>
        <Picker
          selectedValue={versao}
          style={bibliaStyles.versionPicker}
          onValueChange={(itemValue) => setVersao(itemValue)}
        >
          <Picker.Item label="NVI" value="nvi" />
          <Picker.Item label="NAA" value="naa" />
          <Picker.Item label="ACF" value="acf" />
          <Picker.Item label="ARC" value="arc" />
        </Picker>
      </View>

      <ScrollView>
        {/* Antigo Testamento */}
        <TouchableOpacity onPress={() => setExpandAntigo(!expandAntigo)} style={bibliaStyles.sectionHeader}>
          <Text style={bibliaStyles.sectionHeaderText}>Antigo Testamento</Text>
        </TouchableOpacity>
        {expandAntigo && livros["Antigo Testamento"].map((l, idx) => (
          <View key={idx} style={bibliaStyles.bookContainer}>
            <TouchableOpacity onPress={() => setLivroSelecionado(l.value)}>
              <Text style={bibliaStyles.bookText}>{l.name}</Text>
            </TouchableOpacity>
            {livroSelecionado === l.value && (
              <View style={bibliaStyles.chapterContainer}>
                {Array.from({ length: l.chapters }, (_, i) => i + 1).map(num => (
                  <TouchableOpacity key={num} onPress={() => selecionarCapitulo(l.value, num)}>
                    <Text style={bibliaStyles.chapterText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Novo Testamento */}
        <TouchableOpacity onPress={() => setExpandNovo(!expandNovo)} style={bibliaStyles.sectionHeader}>
          <Text style={bibliaStyles.sectionHeaderText}>Novo Testamento</Text>
        </TouchableOpacity>
        {expandNovo && livros["Novo Testamento"].map((l, idx) => (
          <View key={idx} style={bibliaStyles.bookContainer}>
            <TouchableOpacity onPress={() => setLivroSelecionado(l.value)}>
              <Text style={bibliaStyles.bookText}>{l.name}</Text>
            </TouchableOpacity>
            {livroSelecionado === l.value && (
              <View style={bibliaStyles.chapterContainer}>
                {Array.from({ length: l.chapters }, (_, i) => i + 1).map(num => (
                  <TouchableOpacity key={num} onPress={() => selecionarCapitulo(l.value, num)}>
                    <Text style={bibliaStyles.chapterText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Texto do capítulo */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
        ) : (
          textoBiblia ? <Text style={bibliaStyles.text}>{textoBiblia}</Text> : null
        )}
      </ScrollView>
    </View>
  );
}

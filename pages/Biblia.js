import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/bibliaStyles';

export default function Biblia() {
  const [versao, setVersao] = useState('nvi');
  const [livrosAntigo, setLivrosAntigo] = useState([]);
  const [livrosNovo, setLivrosNovo] = useState([]);
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [capitulos, setCapitulos] = useState([]);
  const [capituloSelecionado, setCapituloSelecionado] = useState(null);
  const [versiculos, setVersiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [antigoAberto, setAntigoAberto] = useState(false);
  const [novoAberto, setNovoAberto] = useState(false);
  const [token, setToken] = useState(null);

  // agora armazena chaves (strings) no formato versao:livro:cap:verso
  const [versiculosMarcados, setVersiculosMarcados] = useState([]);

  const scrollRef = useRef();

  // helper para gerar chave única por versículo
  const getVerseKey = (versoNum) => {
    const liv = livroSelecionado?.abbrev?.pt ?? '';
    const cap = capituloSelecionado ?? '';
    return `${versao}:${liv}:${cap}:${versoNum}`;
  };

  // Criar usuário e gerar token
  async function criarUsuario() {
    try {
      const resp = await fetch('https://www.abibliadigital.com.br/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'UsuarioAppBiblia',
          email: `usuario${Date.now()}@exemplo.com`,
          password: 'senha123',
          notifications: false
        })
      });
      const data = await resp.json();
      if (data.token) {
        await AsyncStorage.setItem('tokenBiblia', data.token);
        setToken(data.token);
        return data.token;
      } else {
        Alert.alert("Erro", "Não foi possível gerar token.");
      }
    } catch (err) {
      Alert.alert("Erro", "Falha ao criar usuário.");
      console.error(err);
    }
  }

  // Inicializar token
  async function inicializarToken() {
    const tokenSalvo = await AsyncStorage.getItem('tokenBiblia');
    if (tokenSalvo) setToken(tokenSalvo);
    else await criarUsuario();
  }

  // Fetch com token, renova se expirado
  async function fetchComToken(url) {
    if (!token) return null;
    try {
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await resp.json();
      if (data.msg === "Not authorized token") {
        const novoToken = await criarUsuario();
        if (novoToken) return fetchComToken(url);
      }
      return data;
    } catch (err) {
      console.error("Erro na requisição:", err);
      return null;
    }
  }

  // Carregar livros
  async function carregarLivros() {
    const data = await fetchComToken("https://www.abibliadigital.com.br/api/books");
    if (!data || !Array.isArray(data)) {
      Alert.alert("Erro", "Não foi possível carregar os livros.");
      return;
    }
    setLivrosAntigo(data.filter(l => l.testament === "VT"));
    setLivrosNovo(data.filter(l => l.testament === "NT"));
    setRefreshing(false);
  }

  // Selecionar livro
  function selecionarLivro(livro) {
    setLivroSelecionado(livro);
    setCapitulos(Array.from({ length: livro.chapters }, (_, i) => i + 1));
    setVersiculos([]);
    setCapituloSelecionado(null);
    setLoading(false);
    setAntigoAberto(false);
    setNovoAberto(false);
    // não limpamos as marcações; as chaves são únicas por livro/capítulo/verso
  }

  // Selecionar capítulo
  async function selecionarCapitulo(cap) {
    if (!livroSelecionado) return;

    setCapituloSelecionado(null);
    setLoading(true);
    setVersiculos([]);

    const url = `https://www.abibliadigital.com.br/api/verses/${versao}/${livroSelecionado.abbrev.pt}/${cap}`;
    const data = await fetchComToken(url);

    if (data?.verses && Array.isArray(data.verses)) {
      setVersiculos(data.verses);
      setCapituloSelecionado(cap);
    } else {
      setVersiculos([{ number: 0, text: 'Erro ao carregar capítulo.' }]);
      setCapituloSelecionado(cap);
    }

    setLoading(false);
  }

  // Alternar marcação usando chave única
  function toggleMarcacao(versoNum) {
    const key = getVerseKey(versoNum);
    setVersiculosMarcados((prev) => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      }
      return [...prev, key];
    });
  }

  // Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    setAntigoAberto(false);
    setNovoAberto(false);
    setLivroSelecionado(null);
    setCapituloSelecionado(null);
    setVersiculos([]);
    setCapitulos([]);
    await carregarLivros();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setRefreshing(false);
  };

  useEffect(() => { inicializarToken(); }, []);
  useEffect(() => { if (token) carregarLivros(); }, [token]);

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={styles.scroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Seletor de versão */}
      <Picker selectedValue={versao} style={styles.versaoPicker} onValueChange={setVersao}>
        <Picker.Item label="NVI" value="nvi" />
        <Picker.Item label="ACF" value="acf" />
      </Picker>

      {/* Antigo Testamento */}
      <TouchableOpacity
        style={[styles.folderButton, styles.folderAntigo]}
        onPress={() => setAntigoAberto(!antigoAberto)}
      >
        <Icon name={antigoAberto ? 'folder-open' : 'folder'} size={22} color="#fff" />
        <Text style={styles.folderTextAntigo}>Antigo Testamento</Text>
      </TouchableOpacity>
      {antigoAberto && livrosAntigo.map((livro, idx) => (
        <TouchableOpacity key={idx} onPress={() => selecionarLivro(livro)}>
          <Text style={styles.bookItem}>{livro.name}</Text>
        </TouchableOpacity>
      ))}

      {/* Novo Testamento */}
      <TouchableOpacity
        style={[styles.folderButton, styles.folderNovo]}
        onPress={() => setNovoAberto(!novoAberto)}
      >
        <Icon name={novoAberto ? 'folder-open' : 'folder'} size={22} color="#fff" />
        <Text style={styles.folderTextNovo}>Novo Testamento</Text>
      </TouchableOpacity>
      {novoAberto && livrosNovo.map((livro, idx) => (
        <TouchableOpacity key={idx} onPress={() => selecionarLivro(livro)}>
          <Text style={styles.bookItem}>{livro.name}</Text>
        </TouchableOpacity>
      ))}


      {/* Cabeçalho */}
      {livroSelecionado && !capituloSelecionado && (
        <Text style={styles.selectedTitle}>
          {livroSelecionado.name}
        </Text>
      )}
      {livroSelecionado && capituloSelecionado && (
        <Text style={styles.selectedTitle}>
          {livroSelecionado.name} - {capituloSelecionado}
        </Text>
      )}

      {/* Capítulos */}
      {capitulos.length > 0 && (
        <View style={styles.chapterContainer}>
          {capitulos.map((cap, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.chapterButton,
                capituloSelecionado === cap && styles.chapterButtonSelected
              ]}
              onPress={() => selecionarCapitulo(cap)}
            >
              <Text
                style={[
                  styles.chapterText,
                  capituloSelecionado === cap && styles.chapterTextSelected
                ]}
              >
                {cap}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Versículos */}
      {loading && <ActivityIndicator size="large" color="#000" />}
      {!loading && versiculos.length > 0 && (
        <View style={styles.bibleTextContainer}>
          {versiculos.map(v => {
            const key = getVerseKey(v.number);
            const marcado = versiculosMarcados.includes(key);
            return (
              <TouchableOpacity
                key={key} // chave única e estável
                style={[
                  styles.verseContainer,
                  marcado && styles.verseMarked
                ]}
                onPress={() => toggleMarcacao(v.number)}
              >
                <Text style={styles.verseNumber}>{v.number}</Text>
                <Text style={styles.verseText}>{v.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

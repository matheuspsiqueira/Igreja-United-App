import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import getStyles from '../styles/bibliaStyles';

export default function Biblia() {
  const { theme, isDarkMode } = useContext(ThemeContext); // ✅ tema acessado
  const styles = getStyles(theme); // ✅ agora ele existe!

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


  // Marcações
  const [versiculosMarcados, setVersiculosMarcados] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [versoSelecionado, setVersoSelecionado] = useState(null);
  const coresDisponiveis = ['#ce774a', '#f7dc6f', '#82e0aa', '#85c1e9', '#bb8fce'];

  const scrollRef = useRef();
  useScrollToTop(scrollRef);

  // Gera chave única para cada versículo
  const getVerseKey = (versoNum) => {
    const liv = livroSelecionado?.abbrev?.pt ?? '';
    const cap = capituloSelecionado ?? '';
    return `${versao}:${liv}:${cap}:${versoNum}`;
  };

  // Modal
  function abrirModalMarcacao(versoNum) {
    setVersoSelecionado(versoNum);
    setModalVisible(true);
  }

  function escolherCor(cor) {
    if (versoSelecionado == null) return;
    const key = getVerseKey(versoSelecionado);
    setVersiculosMarcados((prev) => ({ ...prev, [key]: cor }));
    setModalVisible(false);
  }

  function removerMarcacao() {
    if (versoSelecionado == null) return;
    const key = getVerseKey(versoSelecionado);
    setVersiculosMarcados((prev) => {
      const novo = { ...prev };
      delete novo[key];
      return novo;
    });
    setModalVisible(false);
  }

  // Cria usuário e token
  async function criarUsuario() {
    try {
      const resp = await fetch('https://www.abibliadigital.com.br/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'UsuarioAppBiblia',
          email: `usuario${Date.now()}@exemplo.com`,
          password: 'senha123',
          notifications: false,
        }),
      });

      const data = await resp.json();
      if (data.token) {
        await AsyncStorage.setItem('tokenBiblia', data.token);
        setToken(data.token);
        return data.token;
      } else {
        Alert.alert('Erro', 'Não foi possível gerar token.');
      }
    } catch (err) {
      Alert.alert('Erro', 'Falha ao criar usuário.');
      console.error(err);
    }
  }

  // Inicializa token
  async function inicializarToken() {
    const tokenSalvo = await AsyncStorage.getItem('tokenBiblia');
    if (tokenSalvo) setToken(tokenSalvo);
    else await criarUsuario();
  }

  // Fetch com token (auto-renova)
  async function fetchComToken(url) {
    if (!token) return null;

    try {
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await resp.json();

      if (data.msg === 'Not authorized token') {
        const novoToken = await criarUsuario();
        if (novoToken) return fetchComToken(url);
      }

      return data;
    } catch (err) {
      console.error('Erro na requisição:', err);
      return null;
    }
  }

  // Carregar livros
  async function carregarLivros() {
    const data = await fetchComToken('https://www.abibliadigital.com.br/api/books');

    if (!data || !Array.isArray(data)) {
      Alert.alert('Erro', 'Não foi possível carregar os livros.');
      return;
    }

    setLivrosAntigo(data.filter((l) => l.testament === 'VT'));
    setLivrosNovo(data.filter((l) => l.testament === 'NT'));
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

      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 200, animated: true });
      }, 300);
    } else {
      setVersiculos([{ number: 0, text: 'Erro ao carregar capítulo.' }]);
      setCapituloSelecionado(cap);
    }

    setLoading(false);
  }

  // Pull to refresh
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

  useEffect(() => {
    inicializarToken();
  }, []);

  useEffect(() => {
    if (token) carregarLivros();
  }, [token]);

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
        <Ionicons name={antigoAberto ? 'folder-open' : 'folder'} size={22} color="#A1DEA6" />
        <Text style={styles.folderTextAntigo}>Antigo Testamento</Text>
      </TouchableOpacity>

      {antigoAberto &&
        livrosAntigo.map((livro, idx) => (
          <TouchableOpacity key={idx} onPress={() => selecionarLivro(livro)}>
            <Text style={styles.bookItem}>{livro.name}</Text>
          </TouchableOpacity>
        ))}

      {/* Novo Testamento */}
      <TouchableOpacity
        style={[styles.folderButton, styles.folderNovo]}
        onPress={() => setNovoAberto(!novoAberto)}
      >
        <Ionicons name={novoAberto ? 'folder-open' : 'folder'} size={22} color="#A1DEA6" />
        <Text style={styles.folderTextNovo}>Novo Testamento</Text>
      </TouchableOpacity>

      {novoAberto &&
        livrosNovo.map((livro, idx) => (
          <TouchableOpacity key={idx} onPress={() => selecionarLivro(livro)}>
            <Text style={styles.bookItem}>{livro.name}</Text>
          </TouchableOpacity>
        ))}

      {/* Cabeçalho */}
      {livroSelecionado && !capituloSelecionado && (
        <Text style={styles.selectedTitle}>{livroSelecionado.name}</Text>
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
                capituloSelecionado === cap && styles.chapterButtonSelected,
              ]}
              onPress={() => selecionarCapitulo(cap)}
            >
              <Text
                style={[
                  styles.chapterText,
                  capituloSelecionado === cap && styles.chapterTextSelected,
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
          <Text style={styles.verseParagraph}>
            {versiculos.map((v) => {
              const key = getVerseKey(v.number);
              const cor = versiculosMarcados[key];
              return (
                <Text key={key} onPress={() => abrirModalMarcacao(v.number)}>
                  <Text style={styles.verseNumber}>{v.number} </Text>
                  <Text
                    style={[
                      styles.verseText,
                      cor ? { backgroundColor: cor, color: '#000' } : null,
                    ]}
                  >
                    {v.text + ' '}
                  </Text>
                </Text>
              );
            })}
          </Text>
        </View>
      )}

      {/* Modal de marcação */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha uma cor</Text>

            <View style={styles.coresContainer}>
              {coresDisponiveis.map((cor, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.corOpcao, { backgroundColor: cor }]}
                  onPress={() => escolherCor(cor)}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.btnRemover} onPress={removerMarcacao}>
              <Text style={styles.btnRemoverText}>Remover marcação</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

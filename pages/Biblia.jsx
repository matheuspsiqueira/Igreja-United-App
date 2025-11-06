import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Biblia() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();

  const [versao, setVersao] = useState("nvi");
  const [livro, setLivro] = useState("gn");
  const [nomeLivro, setNomeLivro] = useState("Gênesis");
  const [capitulo, setCapitulo] = useState(1);
  const [versiculos, setVersiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formatoCaixaAlta, setFormatoCaixaAlta] = useState(false);
  const [modalVersaoVisible, setModalVersaoVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [versiculosSelecionados, setVersiculosSelecionados] = useState([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  // Novo estado para lista de livros e dropdowns
  const [modalLivrosVisible, setModalLivrosVisible] = useState(false);
  const [livros, setLivros] = useState([]);
  const [livroAberto, setLivroAberto] = useState(null);

// === ANIMAÇÕES DOS BOTÕES ===
const btnAnim1 = useRef(new Animated.Value(0)).current;
const btnAnim2 = useRef(new Animated.Value(0)).current;
const btnAnim3 = useRef(new Animated.Value(0)).current;

const animateButtonsIn = () => {
  Animated.stagger(50, [
    Animated.timing(btnAnim1, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }),
    Animated.timing(btnAnim2, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }),
    Animated.timing(btnAnim3, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }),
  ]).start();
};

const animateButtonsOut = (callback) => {
  Animated.stagger(50, [
    Animated.timing(btnAnim3, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }),
    Animated.timing(btnAnim2, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }),
    Animated.timing(btnAnim1, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }),
  ]).start(() => callback && callback());
};

const getButtonStyle = (anim) => ({
  transform: [{ scale: anim }],
  opacity: anim,
});

// === ANIMAÇÕES DOS BOTÕES DE CORES ===
const [menuCoresAberto, setMenuCoresAberto] = useState(false);
const menuAnim = useRef(new Animated.Value(0)).current;
const coresDisponiveis = ["#ffd700", "#53acc5", "#ff6347", "#32cd32", "#9932cc"];

// Criamos as animações fixas, incluindo o botão "limpar"
const coresAnim = useRef(
  Array.from({ length: coresDisponiveis.length + 1 }, () => new Animated.Value(0))
).current;

const animateCoresIn = () => {
  Animated.stagger(
    50,
    coresAnim.map((anim) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      })
    )
  ).start();
};

const animateCoresOut = (callback) => {
  Animated.stagger(
    50,
    [...coresAnim].reverse().map((anim) =>
      Animated.timing(anim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      })
    )
  ).start(() => callback && callback());
};

const toggleMenuCores = () => {
  if (menuCoresAberto) {
    animateCoresOut(() => {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setMenuCoresAberto(false));
    });
  } else {
    setMenuCoresAberto(true);
    Animated.timing(menuAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start(() => animateCoresIn());
  }
};


  const [versiculosCores, setVersiculosCores] = useState({});

  const aplicarCorVersiculos = (cor) => {
    const novasCores = { ...versiculosCores };
    versiculosSelecionados.forEach((v) => {
      if (cor === "none") delete novasCores[v];
      else novasCores[v] = cor;
    });
    setVersiculosCores(novasCores);
    toggleMenuCores();
  };

  // === TOKEN ===
  async function criarUsuario() {
    try {
      const resp = await fetch("https://www.abibliadigital.com.br/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "UsuarioAppBiblia",
          email: `user${Date.now()}@exemplo.com`,
          password: "senha123",
          notifications: false,
        }),
      });
      const data = await resp.json();
      if (data.token) {
        await AsyncStorage.setItem("tokenBiblia", data.token);
        setToken(data.token);
        return data.token;
      } else Alert.alert("Erro", "Não foi possível gerar token da API.");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao criar usuário na API.");
    }
  }

  async function inicializarToken() {
    const tokenSalvo = await AsyncStorage.getItem("tokenBiblia");
    if (tokenSalvo) setToken(tokenSalvo);
    else await criarUsuario();
  }

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
      console.error(err);
      return null;
    }
  }

  // === CARREGAR CAPÍTULO ===
  async function carregarCapitulo(livroParam, capParam, versaoParam) {
    setLoading(true);
    const url = `https://www.abibliadigital.com.br/api/verses/${versaoParam}/${livroParam}/${capParam}`;
    const data = await fetchComToken(url);
    if (data?.verses) {
      setVersiculos(data.verses);
      setNomeLivro(data.book.name);
      setLivro(data.book.abbrev.pt);
      setCapitulo(capParam);
      setVersao(versaoParam);
      await AsyncStorage.setItem(
        "bibliaProgresso",
        JSON.stringify({ livro: data.book.abbrev.pt, nomeLivro: data.book.name, capitulo: capParam, versao: versaoParam })
      );
      setModalLivrosVisible(false); // Fecha lista de livros
    } else Alert.alert("Erro", "Não foi possível carregar o capítulo.");
    setLoading(false);
  }

  async function restaurarProgresso() {
    const salvo = await AsyncStorage.getItem("bibliaProgresso");
    if (salvo) {
      const { livro, nomeLivro, capitulo, versao } = JSON.parse(salvo);
      setLivro(livro);
      setNomeLivro(nomeLivro);
      setCapitulo(capitulo);
      setVersao(versao);
      await carregarCapitulo(livro, capitulo, versao);
    } else await carregarCapitulo("gn", 1, "nvi");
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarCapitulo(livro, capitulo, versao);
    setRefreshing(false);
  };

  const toggleVersiculoSelecionado = (numero) => {
    setVersiculosSelecionados((prev) =>
      prev.includes(numero) ? prev.filter((n) => n !== numero) : [...prev, numero]
    );
  };

  // === CONTROLE DOS MENUS ===
  useEffect(() => {
    if (versiculosSelecionados.length > 0 && !mostrarMenu) {
      setMostrarMenu(true);
      animateButtonsIn();
    } else if (versiculosSelecionados.length === 0 && mostrarMenu) {
      animateButtonsOut(() => {
        setMostrarMenu(false);
        if (menuCoresAberto) toggleMenuCores();
      });
    }
  }, [versiculosSelecionados]);

  useEffect(() => { inicializarToken(); }, []);
  useEffect(() => { if (token) restaurarProgresso(); }, [token]);

  // === CARREGAR LISTA DE LIVROS ===
  async function carregarLivros() {
    if (!token) return;
    const data = await fetchComToken("https://www.abibliadigital.com.br/api/books");
    if (data && Array.isArray(data)) setLivros(data);
  }

  const abrirListaLivros = async () => {
    await carregarLivros();
    setModalLivrosVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.card }]}>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: theme.buttonBackground }]}
            onPress={abrirListaLivros}
          >
            <Text style={[styles.headerButtonText, { color: theme.text }]}>{nomeLivro} {capitulo}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: theme.buttonBackground }]}
            onPress={() => setModalVersaoVisible(true)}
          >
            <Text style={[styles.headerButtonText, { color: theme.text }]}>{versao.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setFormatoCaixaAlta(!formatoCaixaAlta)}>
          <MaterialIcons name="text-fields" size={24} color={formatoCaixaAlta ? "#53acc5ff" : theme.text} />
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#53acc5ff" />
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={styles.verseContainer}>
          {versiculos.map((v) => {
            const isSelecionado = versiculosSelecionados.includes(v.number);
            const bgColor = versiculosCores[v.number] || "transparent";

            return (
              <TouchableOpacity key={v.number} onPress={() => toggleVersiculoSelecionado(v.number)} activeOpacity={0.7} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 17, lineHeight: 26, color: theme.text, flexWrap: "wrap" }}>
                  <Text style={styles.verseNumber}>{v.number} </Text>
                  <Text
                    style={{
                      backgroundColor: bgColor,
                      textTransform: formatoCaixaAlta ? "uppercase" : "none",
                      borderRadius: 2,
                      lineHeight: 26,
                      color: theme.text,
                      textDecorationLine: isSelecionado ? "underline" : "none",
                      textDecorationStyle: "dotted",
                      textDecorationColor: "#53acc5ff",
                    }}
                  >
                    {v.text.trim()}
                  </Text>
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* === MODAL DE LIVROS E CAPÍTULOS === */}
      <Modal visible={modalLivrosVisible} transparent animationType="slide" onRequestClose={() => setModalLivrosVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalBox, { backgroundColor: theme.card, width: "90%", maxHeight: "85%" }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Selecione um livro</Text>

            <ScrollView>
              {livros.map((liv, i) => (
                <View key={i}>
                  <TouchableOpacity
                    style={[styles.livroItem, { borderBottomColor: theme.border }]}
                    onPress={() => setLivroAberto(liv.abbrev.pt === livroAberto ? null : liv.abbrev.pt)}
                  >
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}>{liv.name}</Text>
                    <Ionicons
                      name={liv.abbrev.pt === livroAberto ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={theme.text}
                    />
                  </TouchableOpacity>

                  {liv.abbrev.pt === livroAberto && (
                    <View style={styles.capitulosContainer}>
                      {Array.from({ length: liv.chapters }, (_, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={styles.capituloBotao}
                          onPress={() => carregarCapitulo(liv.abbrev.pt, idx + 1, versao)}
                        >
                          <Text style={{ color: theme.text }}>{idx + 1}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalLivrosVisible(false)}>
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* RESTANTE DOS MENUS (cores, etc) */}
      {mostrarMenu && (
        <View style={styles.menuFlutuanteGlobal}>
          <Animated.View style={[styles.botaoMenu, { backgroundColor: "#ff4d4d" }, getButtonStyle(btnAnim3)]}>
            <Ionicons name="share-social" size={30} color="#fff" />
          </Animated.View>
          <Animated.View style={[styles.botaoMenu, { backgroundColor: "#d3d3d3" }, getButtonStyle(btnAnim2)]}>
            <Ionicons name="save" size={30} color="#fff" />
          </Animated.View>
          <Animated.View style={[styles.botaoMenu, { backgroundColor: "#ffd700" }, getButtonStyle(btnAnim1)]}>
            <TouchableOpacity onPress={toggleMenuCores}>
              <Ionicons name="pencil" size={30} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {menuCoresAberto && (
  <Animated.View
    style={[
      styles.menuCores,
      {
        transform: [{ translateX: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [200, 0] }) }],
      },
    ]}
  >
    {/* Botão de limpar cor — usa coresAnim[0] */}
    <Animated.View style={getButtonStyle(coresAnim[0])}>
      <TouchableOpacity
        style={[styles.bolinhaCor, { backgroundColor: "#fff", borderColor: "#000" }]}
        onPress={() => aplicarCorVersiculos("none")}
      >
        <View style={{ width: 20, height: 2, backgroundColor: "#000", transform: [{ rotate: "45deg" }] }} />
      </TouchableOpacity>
    </Animated.View>

    {/* Botões coloridos animados — usamos coresAnim[index + 1] */}
    {coresDisponiveis.map((cor, index) => (
      <Animated.View key={index} style={getButtonStyle(coresAnim[index + 1])}>
        <TouchableOpacity style={[styles.bolinhaCor, { backgroundColor: cor }]} onPress={() => aplicarCorVersiculos(cor)} />
      </Animated.View>
    ))}
  </Animated.View>
)}

      {/* MODAL DE VERSÃO */}
      <Modal visible={modalVersaoVisible} transparent animationType="fade" onRequestClose={() => setModalVersaoVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Selecione a versão</Text>
            <TouchableOpacity
              style={[styles.modalOption, { borderBottomColor: theme.border }]}
              onPress={async () => {
                setVersao("nvi");
                await carregarCapitulo(livro, capitulo, "nvi");
                setModalVersaoVisible(false);
              }}
            >
              <Text style={{ color: versao === "nvi" ? "#53acc5ff" : theme.text, fontWeight: "600" }}>NVI</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={async () => {
                setVersao("acf");
                await carregarCapitulo(livro, capitulo, "acf");
                setModalVersaoVisible(false);
              }}
            >
              <Text style={{ color: versao === "acf" ? "#53acc5ff" : theme.text, fontWeight: "600" }}>ACF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVersaoVisible(false)}>
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1 },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerButton: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 },
  headerButtonText: { fontSize: 16, fontWeight: "600", borderWidth: 1.5, borderColor: "#fff", padding: 5 },
  verseContainer: { padding: 16 },
  verseNumber: { color: "#53acc5ff", fontWeight: "bold", fontSize: 16 },
  menuFlutuanteGlobal: { position: "absolute", bottom: 40, right: 20, alignItems: "center", justifyContent: "center", gap: 12, zIndex: 999 },
  botaoMenu: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 4 },
  menuCores: { position: "absolute", flexDirection: "row", gap: 7, zIndex: 999, bottom: 45, right: 80 },
  bolinhaCor: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: "#fff", alignItems: "center", justifyContent: "center" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: 250, borderRadius: 10, padding: 16 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  modalOption: { paddingVertical: 8, borderBottomWidth: 1, alignItems: "center" },
  modalCloseButton: { marginTop: 12, alignItems: "center" },
  modalCloseText: { fontWeight: "bold", backgroundColor: "#53acc5ff", color: "#fff", padding: 8, borderRadius: 10 },

  /* estilos específicos para modal de livros */
  livroItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 6, borderBottomWidth: 1 },
  capitulosContainer: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 6, paddingVertical: 8, gap: 8 },
  capituloBotao: { minWidth: 36, height: 36, borderRadius: 6, alignItems: "center", justifyContent: "center", margin: 4, borderWidth: 1, borderColor: "#ddd" },

  /* pequenos ajustes responsivos */
  '@media (min-width: 600px)': {
    modalBox: { width: 500 }
  }
});

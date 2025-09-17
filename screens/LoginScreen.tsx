import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";

export default function LoginScreen({ navigation }: any) {
  // Estados para guardar o que o usuário digita
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // mostra erro se login falhar

  //  Função de login com Supabase
  const handleLogin = async () => {
    // tenta logar usando email + senha
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // se deu erro, guarda a mensagem no estado para exibir na tela
      setError(error.message);
    }
    // se deu certo, o App.tsx já vai detectar a sessão e redirecionar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      {/* Campo de e-mail */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Campo de senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />


      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Button title="Entrar" onPress={handleLogin} />


      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Signup")}
      >
        Não tem conta? Cadastre-se
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  link: { color: "blue", marginTop: 20, textAlign: "center" },
});

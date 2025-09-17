import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { supabase } from "../lib/supabase";

export default function SignupScreen({ navigation }: any) {
  // Estados para capturar os valores digitados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // controla o botão de "Cadastrar"

  //  Função que executa o cadastro do usuário
  async function handleSignup() {
    setLoading(true); // mostra "Cadastrando..." no botão

    // cria usuário no Supabase (auth)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false); // volta ao estado normal

    if (error) {
      // se deu erro, mostra alerta
      Alert.alert("Erro", error.message);
      return;
    }

    // se cadastrou com sucesso, pede confirmação no e-mail
    Alert.alert(
      "Cadastro realizado",
      "Verifique seu e-mail para confirmar a conta!"
    );


    navigation.replace("Login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      {/* Campo para digitar e-mail */}
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />


      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={loading ? "Cadastrando..." : "Cadastrar"}
        onPress={handleSignup}
        disabled={loading}
      />


      <Text
        style={styles.link}
        onPress={() => navigation.replace("Login")}
      >
        Já tem conta? Entrar
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

//this file automatically becomes the /profile screen.

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

//back arrow function
type ProfileProps = {
  onBack: () => void
}

export default function Profile({ onBack }: ProfileProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.header}>← Profile</Text>
      </TouchableOpacity>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>JD</Text>
      </View>

      <Text style={styles.name}>Jane Doe</Text>
      <Text style={styles.subtitle}>Profile Information</Text>

      <View style={styles.card}>
        <Field label="Email" value="jane.doe@email.com" editable={undefined} />
        <Field label="Full Name" value="Jane Doe" editable />
        <Field label="Account Created" value="January 15, 2025" editable={undefined} />
        <Field label="ZIP Code" value="94027" editable />
      </View>

      <TouchableOpacity style={styles.logout}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  );
}

type FieldProps = {
  label: string
  value: string
  editable?: boolean
}

function Field({ label, value, editable }:FieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldHeader}>
        <Text style={styles.label}>{label}</Text>
        {editable && <Text style={styles.edit}>Edit</Text>}
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  header: {
    fontSize: 20,
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#5da95d",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 32,
  },

  name: {
    textAlign: "center",
    fontSize: 24,
    marginTop: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
  },

  field: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 12,
  },

  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    color: "#6b7280",
    fontSize: 14,
  },

  edit: {
    color: "#22a55a",
  },

  value: {
    fontSize: 18,
    marginTop: 4,
  },

  logout: {
    marginTop: 20,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },

  logoutText: {
    color: "#ef4444",
    fontWeight: "bold",
  },
});
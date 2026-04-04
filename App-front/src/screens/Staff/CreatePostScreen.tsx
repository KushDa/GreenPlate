import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreatePostScreen = () => (
  <View style={styles.container}>
    <Text>Create Post</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default CreatePostScreen;

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  FlatList,
  View,
} from 'react-native';
import type {Product, ProductID} from './models/Product';
import {createProduct} from './models/Product';

export default function App(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState<ProductID | null>(null);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setId('');
    setName('');
    setPrice('');
    setEditingId(null);
    setError(null);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setError(null);
  }

  function saveProduct() {
    setError(null);

    const trimmedId = id.trim();
    if (!editingId && products.some(p => p.id === trimmedId)) {
      setError('Product ID already exists');
      return;
    }

    let product: Product;
    try {
      product = createProduct(id as ProductID, name, Number(price));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid input');
      return;
    }

    if (editingId) {
      setProducts(items =>
        items.map(existingProduct => (existingProduct.id === editingId ? product : existingProduct))
      );
    } else {
      setProducts(previousValue => [product, ...previousValue]);
    }

    resetForm();
  }

  function deleteProduct(id: ProductID) {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    if (editingId === id) {
      resetForm();
    }
  }

  function handleCardPress(product: Product, event: any) {
      console.log('handleCardPress', event);
      debugger;
    const clickCount = event.nativeEvent.clickCount;
    if (clickCount === 2) {
      console.log('Double clicked on', product.id);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Products</Text>

      <View style={styles.form}>
        <Text style={styles.label}>ID</Text>
        <TextInput
          style={[styles.input, editingId ? styles.inputDisabled : null]}
          value={id}
          onChangeText={setId}
          placeholder="sku-123"
          editable={!editingId}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="iPhone cable"
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="12.99"
          keyboardType="decimal-pad"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={saveProduct}>
            <Text style={styles.primaryButtonText}>
              {editingId ? 'Update' : 'Create'}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No Products yet</Text>}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <Pressable style={styles.card} onPress={event => handleCardPress(item, event)}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.meta}>ID: {item.id}</Text>
            <View style={styles.cardActions}>
              <Pressable
                style={styles.smallButton}
                onPress={() => startEdit(item)}
              >
                <Text style={styles.smallButtonText}>Edit</Text>
              </Pressable>
              <Pressable
                style={[styles.smallButton, styles.dangerButton]}
                onPress={() => deleteProduct(item.id)}
              >
                <Text style={styles.smallButtonText}>Delete</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F5F0', padding: 16},
  title: {fontSize: 28, fontWeight: '700', marginBottom: 12},
  form: {backgroundColor: '#FFF', padding: 12, borderRadius: 10},
  label: {fontSize: 14, fontWeight: '600', marginTop: 10},
  input: {
    borderWidth: 1,
    borderColor: '#D6CFC7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 6,
  },
  inputDisabled: {backgroundColor: '#EFEAE4', color: '#666'},
  error: {color: '#B42318', marginTop: 8},
  actions: {flexDirection: 'row', gap: 10, marginTop: 12},
  primaryButton: {
    backgroundColor: '#1F2A44',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  primaryButtonText: {color: '#FFF', fontWeight: '700'},
  secondaryButton: {
    backgroundColor: '#E7E0D8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  secondaryButtonText: {fontWeight: '700', color: '#1F2A44'},
  listContent: {paddingVertical: 12},
  empty: {marginTop: 16, color: '#666'},
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  name: {fontSize: 18, fontWeight: '600'},
  price: {fontSize: 16, fontWeight: '600'},
  meta: {color: '#666', marginTop: 4},
  cardActions: {flexDirection: 'row', gap: 8, marginTop: 10},
  smallButton: {
    backgroundColor: '#1F2A44',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  dangerButton: {backgroundColor: '#B42318'},
  smallButtonText: {color: '#FFF', fontWeight: '600'},
});
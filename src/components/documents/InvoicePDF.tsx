import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1 solid #000', paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 5 },
  subtitle: { fontSize: 10, color: '#666', marginBottom: 5 },
  info: { fontSize: 9, marginBottom: 3 },
  table: { marginTop: 15, borderStyle: 'solid', borderWidth: 1, borderColor: '#000' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e3a8a', color: '#fff', padding: 4, fontSize: 9 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#000', padding: 4, fontSize: 9 },
  totalBox: { marginTop: 10, textAlign: 'right', fontSize: 12, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#666' }
});

interface InvoicePDFProps {
  data: {
    number: string;
    date: string;
    client: { name: string; cuil?: string; address?: string; type: string };
    items: { sku: string; name: string; qty: number; price: number; total: number; image?: string }[];
    subtotal: number;
    tax: number;
    total: number;
    type: string;
  };
}

export const InvoicePDF = ({ data }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>R.A.P.E.L TANDIL</Text>
          <Text style={styles.subtitle}>Distribuidora de Herramientas EMTOP | Aceites SHELL | Neumáticos DUNLOP</Text>
          <Text style={styles.info}>Tandil, Buenos Aires</Text>
          <Text style={styles.info}>CUIT: 30-12345678-9</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' }}>{data.type}</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{data.number}</Text>
          <Text style={styles.info}>Fecha: {data.date}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 20, padding: 10, backgroundColor: '#f8f9fa', borderRadius: 4 }}>
        <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 2 }}>Cliente:</Text>
        <Text style={styles.info}>{data.client.name}</Text>
        {data.client.cuil && <Text style={styles.info}>CUIT/DNI: {data.client.cuil}</Text>}
        {data.client.address && <Text style={styles.info}>{data.client.address}</Text>}
        <Text style={styles.info}>Tandil, Buenos Aires</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableHeader, { backgroundColor: '#1e3a8a', color: '#fff' }]}>
          <Text style={{ flex: 1, color: '#fff' }}>SKU</Text>
          <Text style={{ flex: 3, color: '#fff' }}>Descripción</Text>
          <Text style={{ flex: 1, textAlign: 'right', color: '#fff' }}>Cant.</Text>
          <Text style={{ flex: 2, textAlign: 'right', color: '#fff' }}>Precio</Text>
          <Text style={{ flex: 2, textAlign: 'right', color: '#fff' }}>Total</Text>
        </View>
        {data.items.map((item, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={{ flex: 1 }}>{item.sku}</Text>
            <Text style={{ flex: 3 }}>{item.name}</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>{item.qty}</Text>
            <Text style={{ flex: 2, textAlign: 'right' }}>${item.price.toFixed(2)}</Text>
            <Text style={{ flex: 2, textAlign: 'right', fontWeight: 'bold' }}>${item.total.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalBox}>
        <Text>Subtotal: ${data.subtotal.toFixed(2)}</Text>
        <Text>IVA (21%): ${data.tax.toFixed(2)}</Text>
        <Text style={{ fontSize: 16, marginTop: 5, color: '#1e3a8a' }}>TOTAL: ${data.total.toFixed(2)}</Text>
      </View>

      <View style={styles.footer}>
        <Text>Gracias por su preferencia. R.A.P.E.L - Distribuidora Autorizada.</Text>
        <Text>Para consultas: ventas@rapel.com.ar | Tel: 0249-442-xxxx</Text>
      </View>
    </Page>
  </Document>
);
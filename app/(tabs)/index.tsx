import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

type VaccineStatus = "Planlandı" | "Yaklaşıyor" | "Tamamlandı";

type Vaccine = {
  id: number;
  name: string;
  date: string;
  nextDate: string;
  status: VaccineStatus;
};

type Routine = {
  id: number;
  title: string;
  value: string;
};

type CatProfile = {
  id: number;
  name: string;
  age: string;
  breed: string;
  gender: string;
  weight: string;
  image: string;
  nextVaccine: string;
  vitaminStatus: string;
  healthNote: string;
  vaccines: Vaccine[];
  routines: Routine[];
};

const initialCats: CatProfile[] = [
  {
    id: 1,
    name: "Misket",
    age: "8 aylık",
    breed: "Tekir",
    gender: "Erkek",
    weight: "3.1 kg",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80",
    nextVaccine: "30 Nisan 2026",
    vitaminStatus: "Yarın verilecek",
    healthNote: "Su tüketimi takip edilmeli.",
    vaccines: [
      {
        id: 1,
        name: "İç Parazit",
        date: "01 Mart 2026",
        nextDate: "30 Nisan 2026",
        status: "Yaklaşıyor",
      },
      {
        id: 2,
        name: "Karma Aşı",
        date: "10 Şubat 2026",
        nextDate: "10 Şubat 2027",
        status: "Tamamlandı",
      },
    ],
    routines: [
      {
        id: 1,
        title: "Akşam Maması",
        value: "Verildi",
      },
      {
        id: 2,
        title: "Omega Desteği",
        value: "Yarın",
      },
    ],
  },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isWebWide = width >= 900;

  const [cats] = useState<CatProfile[]>(initialCats);
  const [selectedCatId, setSelectedCatId] = useState<number>(initialCats[0].id);
  const [activeTab, setActiveTab] = useState<"genel" | "asilar" | "rutinler">(
    "genel"
  );
  const [searchText, setSearchText] = useState("");

  const filteredCats = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return cats;

    return cats.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.breed.toLowerCase().includes(query)
    );
  }, [cats, searchText]);

  const selectedCat =
    filteredCats.find((cat) => cat.id === selectedCatId) ?? filteredCats[0];

  const totalVaccines = selectedCat?.vaccines.length ?? 0;
  const completedVaccines =
    selectedCat?.vaccines.filter((item) => item.status === "Tamamlandı").length ??
    0;

  if (!selectedCat) {
    return (
      <LinearGradient
        colors={["#020617", "#0f172a", "#312e81"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safe}>
          <StatusBar barStyle="light-content" />
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Kedi profili bulunamadı</Text>
            <Text style={styles.emptyText}>
              Arama kutusunu temizleyip tekrar dene.
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#312e81"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.pageWrap, isWebWide && styles.pageWrapWide]}>
            <View style={styles.header}>
              <Text style={styles.logo}>Benim Miov 🐾</Text>
              <Text style={styles.subtitle}>
                Kedi sağlık ve bakım takip ekranı
              </Text>
            </View>

            <View style={styles.searchCard}>
              <Text style={styles.sectionLabel}>Kedi Ara</Text>
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="İsim veya ırk yaz..."
                placeholderTextColor="#94a3b8"
                style={styles.input}
              />
            </View>

            <Text style={styles.sectionTitle}>Kedi Profilleri</Text>

            <View style={styles.cardList}>
              {filteredCats.map((cat) => {
                const isActive = cat.id === selectedCat.id;

                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCatId(cat.id)}
                    style={[
                      styles.catCard,
                      isActive && styles.catCardActive,
                    ]}
                  >
                    <Image source={{ uri: cat.image }} style={styles.catImage} />

                    <View style={styles.catInfo}>
                      <View style={styles.catTopRow}>
                        <View style={styles.catTextWrap}>
                          <Text style={styles.catName}>{cat.name}</Text>
                          <Text style={styles.catMeta}>
                            {cat.age} • {cat.breed}
                          </Text>
                        </View>

                        <View style={styles.activeBadge}>
                          <Text style={styles.activeBadgeText}>
                            {isActive ? "Seçili" : "Profil"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoGrid}>
                        <View style={styles.infoBox}>
                          <Text style={styles.infoLabel}>Sonraki Aşı</Text>
                          <Text style={styles.infoValueGreen}>
                            {cat.nextVaccine}
                          </Text>
                        </View>

                        <View style={styles.infoBox}>
                          <Text style={styles.infoLabel}>Vitamin</Text>
                          <Text style={styles.infoValueYellow}>
                            {cat.vitaminStatus}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.noteBox}>
                        <Text style={styles.infoLabel}>Günlük Not</Text>
                        <Text style={styles.noteText}>{cat.healthNote}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Seçili Profil</Text>

            <View style={styles.profileCard}>
              <Image
                source={{ uri: selectedCat.image }}
                style={styles.profileImage}
              />

              <Text style={styles.profileName}>{selectedCat.name}</Text>
              <Text style={styles.profileMeta}>
                {selectedCat.breed} • {selectedCat.gender} • {selectedCat.weight}
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{totalVaccines}</Text>
                  <Text style={styles.statLabel}>Toplam Aşı</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{completedVaccines}</Text>
                  <Text style={styles.statLabel}>Tamamlanan</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statValue}>1</Text>
                  <Text style={styles.statLabel}>Aktif Profil</Text>
                </View>
              </View>

              <View style={styles.tabs}>
                <Pressable
                  onPress={() => setActiveTab("genel")}
                  style={[
                    styles.tabButton,
                    activeTab === "genel" && styles.tabButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "genel" && styles.tabTextActive,
                    ]}
                  >
                    Genel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab("asilar")}
                  style={[
                    styles.tabButton,
                    activeTab === "asilar" && styles.tabButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "asilar" && styles.tabTextActive,
                    ]}
                  >
                    Aşılar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab("rutinler")}
                  style={[
                    styles.tabButton,
                    activeTab === "rutinler" && styles.tabButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "rutinler" && styles.tabTextActive,
                    ]}
                  >
                    Rutinler
                  </Text>
                </Pressable>
              </View>

              {activeTab === "genel" && (
                <View style={styles.panel}>
                  <View style={styles.panelItem}>
                    <Text style={styles.panelItemLabel}>Yaş</Text>
                    <Text style={styles.panelItemValue}>{selectedCat.age}</Text>
                  </View>

                  <View style={styles.panelItem}>
                    <Text style={styles.panelItemLabel}>Sonraki Aşı</Text>
                    <Text style={styles.panelItemValue}>
                      {selectedCat.nextVaccine}
                    </Text>
                  </View>

                  <View style={styles.panelItem}>
                    <Text style={styles.panelItemLabel}>Vitamin Durumu</Text>
                    <Text style={styles.panelItemValue}>
                      {selectedCat.vitaminStatus}
                    </Text>
                  </View>

                  <View style={styles.panelItem}>
                    <Text style={styles.panelItemLabel}>Sağlık Notu</Text>
                    <Text style={styles.panelItemValue}>
                      {selectedCat.healthNote}
                    </Text>
                  </View>
                </View>
              )}

              {activeTab === "asilar" && (
                <View style={styles.panel}>
                  {selectedCat.vaccines.map((vaccine) => (
                    <View key={vaccine.id} style={styles.listCard}>
                      <View style={styles.listLeft}>
                        <Text style={styles.listTitle}>{vaccine.name}</Text>
                        <Text style={styles.listMeta}>
                          Yapıldığı tarih: {vaccine.date}
                        </Text>
                        <Text style={styles.listMeta}>
                          Sonraki tarih: {vaccine.nextDate}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          vaccine.status === "Tamamlandı" && styles.statusDone,
                          vaccine.status === "Yaklaşıyor" && styles.statusSoon,
                          vaccine.status === "Planlandı" && styles.statusPlan,
                        ]}
                      >
                        <Text style={styles.statusText}>{vaccine.status}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {activeTab === "rutinler" && (
                <View style={styles.panel}>
                  {selectedCat.routines.map((routine) => (
                    <View key={routine.id} style={styles.listCard}>
                      <View style={styles.listLeft}>
                        <Text style={styles.listTitle}>{routine.title}</Text>
                        <Text style={styles.listMeta}>Günlük takip kaydı</Text>
                      </View>
                      <Text style={styles.routineValue}>{routine.value}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 110,
  },
  pageWrap: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  pageWrapWide: {
    maxWidth: 980,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    marginBottom: 20,
  },
  logo: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "800",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    marginTop: 6,
  },
  searchCard: {
    backgroundColor: "rgba(17, 28, 45, 0.88)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sectionLabel: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#162338",
    color: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 14,
    marginTop: 4,
  },
  cardList: {
    marginBottom: 8,
  },
  catCard: {
    backgroundColor: "rgba(17, 28, 45, 0.9)",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  catCardActive: {
    borderColor: "#8b5cf6",
  },
  catImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  catInfo: {
    padding: 16,
  },
  catTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 10,
  },
  catTextWrap: {
    flex: 1,
  },
  catName: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
  },
  catMeta: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },
  activeBadge: {
    backgroundColor: "rgba(139,92,246,0.16)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  activeBadgeText: {
    color: "#ddd6fe",
    fontSize: 12,
    fontWeight: "700",
  },
  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#162338",
    borderRadius: 16,
    padding: 12,
  },
  infoLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6,
  },
  infoValueGreen: {
    color: "#86efac",
    fontSize: 14,
    fontWeight: "700",
  },
  infoValueYellow: {
    color: "#fde68a",
    fontSize: 14,
    fontWeight: "700",
  },
  noteBox: {
    backgroundColor: "#162338",
    borderRadius: 16,
    padding: 12,
  },
  noteText: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
  },
  profileCard: {
    backgroundColor: "rgba(17, 28, 45, 0.92)",
    borderRadius: 24,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  profileImage: {
    width: "100%",
    height: 240,
    borderRadius: 18,
    marginBottom: 16,
    resizeMode: "cover",
  },
  profileName: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },
  profileMeta: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#162338",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  statValue: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    backgroundColor: "#162338",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#8b5cf6",
  },
  tabText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#ffffff",
  },
  panel: {
    gap: 10,
  },
  panelItem: {
    backgroundColor: "#162338",
    borderRadius: 16,
    padding: 14,
  },
  panelItemLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6,
  },
  panelItemValue: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  listCard: {
    backgroundColor: "#162338",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  listLeft: {
    flex: 1,
  },
  listTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  listMeta: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 18,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusDone: {
    backgroundColor: "rgba(34,197,94,0.16)",
  },
  statusSoon: {
    backgroundColor: "rgba(251,191,36,0.16)",
  },
  statusPlan: {
    backgroundColor: "rgba(96,165,250,0.16)",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  routineValue: {
    color: "#ddd6fe",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
  },
});
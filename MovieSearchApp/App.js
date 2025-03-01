import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Ícones para a barra inferior
import Config from './MovieSearch.env';

const API_KEY = Config.API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Componente Home
function HomeScreen({ navigation, theme, toggleTheme }) {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPopularMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
        },
      });
      setPopularMovies(response.data.results);
    } catch (err) {
      console.error('Erro ao buscar filmes populares:', err);
    }
  };

  const fetchTopRatedMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
        params: {
          api_key: API_KEY,
        },
      });
      setTopRatedMovies(response.data.results);
    } catch (err) {
      console.error('Erro ao buscar filmes mais bem avaliados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularMovies();
    fetchTopRatedMovies();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.header}>
        <Text style={[styles.logo, theme === 'dark' ? styles.darkText : styles.lightText]}>MELT Filmes</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleButton}>
          <Text style={styles.buttonText}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>Filmes Populares</Text>
      <FlatList
        horizontal
        data={popularMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}>
            <View style={styles.movieCard}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.movieImage}
              />
              <Text style={[styles.movieTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Text style={[styles.sectionTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>Filmes Mais Bem Avaliados</Text>
      <FlatList
        horizontal
        data={topRatedMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}>
            <View style={styles.movieCard}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.movieImage}
              />
              <Text style={[styles.movieTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

// Componente Search
function SearchScreen({ navigation, theme }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = async () => {
    if (!searchQuery) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: searchQuery,
        },
      });

      if (response.data.results && response.data.results.length > 0) {
        setMovies(response.data.results);
      } else {
        setError('Nenhum filme encontrado.');
      }
    } catch (err) {
      console.error('Erro ao buscar filmes:', err);
      setError('Erro ao buscar filmes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <TextInput
        style={[styles.input, theme === 'dark' ? styles.darkInput : styles.lightInput]}
        placeholder="Buscar filme..."
        placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Buscar" onPress={searchMovies} color="#007BFF" />

      {loading && <ActivityIndicator size="large" color="#007BFF" />}
      {error && <Text style={[styles.error, theme === 'dark' ? styles.darkText : styles.lightText]}>{error}</Text>}

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.searchListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.searchMovieCard, theme === 'dark' ? styles.darkCard : styles.lightCard]}
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
          >
            <View style={styles.movieRow}>
              {item.poster_path ? (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                  style={styles.movieBanner}
                />
              ) : (
                <View style={styles.placeholderImage} />
              )}
              <View style={styles.movieDetails}>
                <Text style={[styles.movieTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>{item.title}</Text>
                <Text style={[styles.movieReleaseDate, theme === 'dark' ? styles.darkText : styles.lightText]}>
                  {item.release_date ? item.release_date : 'Data não disponível'}
                </Text>
                <Text style={[styles.movieOverview, theme === 'dark' ? styles.darkText : styles.lightText]}>
                  {item.overview ? item.overview.slice(0, 120) + '...' : 'Sem sinopse disponível'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Componente Categorias
function CategoriesScreen({ navigation, theme }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
        params: {
          api_key: API_KEY,
        },
      });
      setCategories(response.data.genres);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <Text style={[styles.sectionTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>Categorias</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Exibe os cartões em 2 colunas
        contentContainerStyle={styles.categoryListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryCard, theme === 'dark' ? styles.darkCard : styles.lightCard]}
            onPress={() => navigation.navigate('CategoryMovies', { genreId: item.id, genreName: item.name })}
          >
            <Icon name="film" size={24} color={theme === 'dark' ? '#fff' : '#333'} style={styles.categoryIcon} />
            <Text style={[styles.categoryText, theme === 'dark' ? styles.darkText : styles.lightText]}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Componente Filmes por Categoria
function CategoryMoviesScreen({ route, theme }) {
  const { genreId, genreName } = route.params;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMoviesByGenre = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          with_genres: genreId,
        },
      });
      setMovies(response.data.results);
    } catch (err) {
      console.error('Erro ao buscar filmes por categoria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesByGenre();
  }, [genreId]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <Text style={[styles.sectionTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>Filmes de {genreName}</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}>
            <View style={styles.movieCard}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.movieImage}
              />
              <Text style={[styles.movieTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

// Componente Detalhes do Filme
function MovieDetailsScreen({ route, theme }) {
  const { movieId } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
        },
      });
      setMovieDetails(response.data);
    } catch (err) {
      console.error('Erro ao buscar detalhes do filme:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!movieDetails) {
    return <Text style={styles.error}>Detalhes não encontrados.</Text>;
  }

  return (
    <ScrollView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` }}
        style={styles.poster}
      />
      <Text style={[styles.movieTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>{movieDetails.title}</Text>
      <Text style={[styles.movieOverview, theme === 'dark' ? styles.darkText : styles.lightText]}>
        {movieDetails.overview}
      </Text>

      <View style={styles.movieInfoBlock}>
        <Text style={[styles.movieInfoText, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Avaliação: {movieDetails.vote_average}
        </Text>
        <Text style={[styles.movieInfoText, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Data de lançamento: {movieDetails.release_date}
        </Text>
        <Text style={[styles.movieInfoText, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Duração: {movieDetails.runtime} minutos
        </Text>
      </View>

      <Text style={[styles.movieSubtitle, theme === 'dark' ? styles.darkText : styles.lightText]}>Gêneros:</Text>
      <View style={styles.genreList}>
        {movieDetails.genres.map((genre) => (
          <Text key={genre.id} style={[styles.genreItem, theme === 'dark' ? styles.darkText : styles.lightText]}>
            {genre.name}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

// Navegação
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs({ theme, toggleTheme }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Início') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Buscar') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Categorias') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#121212' : '#F7F7F7',
        },
      })}
    >
      <Tab.Screen name="Início">
        {(props) => <HomeScreen {...props} theme={theme} toggleTheme={toggleTheme} />}
      </Tab.Screen>
      <Tab.Screen name="Buscar">
        {(props) => <SearchScreen {...props} theme={theme} />}
      </Tab.Screen>
      <Tab.Screen name="Categorias">
        {(props) => <CategoriesScreen {...props} theme={theme} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Componente Principal
export default function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeTabs" options={{ headerShown: false }}>
          {(props) => <HomeTabs {...props} theme={theme} toggleTheme={toggleTheme} />}
        </Stack.Screen>
        <Stack.Screen name="MovieDetails">
          {(props) => <MovieDetailsScreen {...props} theme={theme} />}
        </Stack.Screen>
        <Stack.Screen name="CategoryMovies">
          {(props) => <CategoryMoviesScreen {...props} theme={theme} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  lightBackground: {
    backgroundColor: '#F7F7F7',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  themeToggleButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  darkInput: {
    backgroundColor: '#444',
    color: '#fff',
    borderColor: '#555',
  },
  lightInput: {
    backgroundColor: '#fff',
    color: '#333',
    borderColor: '#007BFF',
  },
  movieCard: {
    marginRight: 16,
    width: 150,
    alignItems: 'center',
  },
  movieImage: {
    width: 150,
    height: 225,
    borderRadius: 8,
  },
  searchMovieCard: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  darkCard: {
    backgroundColor: '#333',
  },
  lightCard: {
    backgroundColor: '#fff',
  },
  movieBanner: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 100,
    height: 150,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  movieDetails: {
    flex: 1,
    marginLeft: 15,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  movieReleaseDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  movieOverview: {
    fontSize: 14,
    marginTop: 8,
  },
  movieSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  movieInfoBlock: {
    marginTop: 12,
  },
  movieInfoText: {
    fontSize: 14,
    marginTop: 8,
  },
  genreList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  genreItem: {
    backgroundColor: '#007BFF',
    color: '#fff',
    borderRadius: 5,
    padding: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  poster: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryListContainer: {
    paddingHorizontal: 8,
  },
});
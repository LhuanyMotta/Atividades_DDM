import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Config from './API_KEY.env';

// Chave da API TMDB
const API_KEY = Config.API_KEY; // Modifique para a sua KEY, pois não forneci a minha nesse código fonte
const BASE_URL = 'https://api.themoviedb.org/3';

// Componente Home
function HomeScreen({ navigation }) {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar filmes populares
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

  // Função para buscar filmes mais bem avaliados
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao App de Filmes</Text>

      <Text style={styles.sectionTitle}>Filmes Populares</Text>
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
              <Text style={styles.movieTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sectionTitle}>Filmes Mais Bem Avaliados</Text>
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
              <Text style={styles.movieTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search')}>
        <Text style={styles.buttonText}>Buscar mais filmes</Text>
      </TouchableOpacity>
    </View>
  );
}

// Componente de busca de filmes
function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função de busca
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar filme..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Buscar" onPress={searchMovies} color="#007BFF" />

      {loading && <ActivityIndicator size="large" color="#007BFF" />}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* FlatList para exibir os filmes encontrados */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.searchListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.searchMovieCard}
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
                <Text style={styles.movieTitle}>{item.title}</Text>
                <Text style={styles.movieReleaseDate}>
                  {item.release_date ? item.release_date : 'Data não disponível'}
                </Text>
                <Text style={styles.movieOverview}>
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

// Tela de detalhes do filme
function MovieDetailsScreen({ route }) {
  const { movieId } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar detalhes do filme
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!movieDetails) {
    return <Text style={styles.error}>Detalhes não encontrados.</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` }}
        style={styles.poster}
      />
      <Text style={styles.movieTitle}>{movieDetails.title}</Text>
      <Text style={styles.movieOverview}>{movieDetails.overview}</Text>

      <View style={styles.movieInfoBlock}>
        <Text style={styles.movieInfoText}>Avaliação: {movieDetails.vote_average}</Text>
        <Text style={styles.movieInfoText}>Data de lançamento: {movieDetails.release_date}</Text>
        <Text style={styles.movieInfoText}>Duração: {movieDetails.runtime} minutos</Text>
      </View>

      <Text style={styles.movieSubtitle}>Gêneros:</Text>
      <View style={styles.genreList}>
        {movieDetails.genres.map((genre) => (
          <Text key={genre.id} style={styles.genreItem}>
            {genre.name}
          </Text>
        ))}
      </View>
    </View>
  );
}

const Stack = createStackNavigator();

// Componente de navegação
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  searchListContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  searchMovieCard: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  movieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  movieReleaseDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  movieOverview: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  poster: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    marginBottom: 16,
  },
  movieInfoBlock: {
    marginTop: 12,
  },
  movieInfoText: {
    fontSize: 14,
    color: '#555',
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
  movieSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});
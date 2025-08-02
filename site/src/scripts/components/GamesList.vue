<template>
<!-- eslint-disable -->
  <div>
	<h1>Games List</h1>

	<input 
		type="text"
		v-model="searchInput"
		placeholder="Search"
	>

	<!-- Filters -->
	<div>
		<select v-model="filters.releaseYear">
			<option value="">All Years</option>
			<option v-for="year in releaseYears" :key="year" :value="year">{{ year }}</option>
		</select>

		<select v-model="filters.genre">
			<option value="">All Genres</option>
			<option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
		</select>

		<select v-model="filters.studio">
			<option value="">All Studios</option>
			<option v-for="studio in studios" :key="studio" :value="studio">{{ studio }}</option>
		</select>

        <select v-model="filters.status" class="p-2 border rounded">
          <option value="">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Not Started">Not Started</option>
        </select>
	</div>

	<!-- List of games -->
	 <ul>
		<li v-for="game in filteredGames" :key="game.id">
			<h2>{{ game.title }}</h2>
			<p>Year: {{ game.releaseYear }} | Genre: {{ game.genre }} | Studio: {{ game.studio }} | Status: {{ game.status }}</p>
		</li>
	 </ul>
  </div>
</template>

<script>
import Fuse from 'fuse.js';

export default {
	name: 'GamesList',

	data() {
	  return {
		searchInput: '',
		filters: {
			releaseYear: '',
			genre: '',
			studio: '',
			status: ''
		},

		games: [
		  { id: 1, title: 'Adventure Quest', releaseYear: 2020, genre: 'RPG', studio: 'DevStudio A', status: 'Completed' },
		  { id: 2, title: 'Battle Arena', releaseYear: 2021, genre: 'Action', studio: 'DevStudio B', status: 'In Progress' },
		  { id: 3, title: 'Puzzle World', releaseYear: 2022, genre: 'Puzzle', studio: 'DevStudio A', status: 'Not Started' },
		  { id: 4, title: 'Action Heroes', releaseYear: 2020, genre: 'Action', studio: 'DevStudio C', status: 'Completed' },
		]
	  };
	},

	computed: {
		releaseYears() {
			return [...new Set(this.games.map(game => game.releaseYear))].sort();
		},
		
		genres() {
			return [...new Set(this.games.map(game => game.genre))].sort();
		},
		
		studios() {
			return [...new Set(this.games.map(game => game.studio))].sort();
		},

		filteredGames() {
			let results = this.games;

			if(this.searchInput) {
				const fuse = new Fuse(this.games, {
					keys: ['title'],
					threshold: 0.3
				});
				results = fuse.search(this.searchInput).map(result => result.item)
			}

			return results.filter(game => {
				return (
					(!this.filters.releaseYear || game.releaseYear === parseInt(this.filters.releaseYear)) &&
					(!this.filters.genre || game.genre === this.filters.genre) &&
					(!this.filters.studio || game.studio === this.filters.studio) &&
					(!this.filters.status || game.status === this.filters.status)
				)
			})
		}
	}
  };
</script>


<style scoped>
</style>

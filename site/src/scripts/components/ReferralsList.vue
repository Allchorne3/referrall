<template>
<!-- eslint-disable -->
  <div>
	<div class="special-container">
		<input 
		type="text"
		v-model="searchInput"
		placeholder="Search"
		name="search"
		>
	</div>

	<div class="referrals-list">
		<!-- Filters -->
		<div class="filters">
			<h2>Filters ({{ filters.selectedCategories.length }})</h2>
			<div class="category-filters">
				<button 
				v-for="cat in appCategories" 
				:key="cat" 
				class="filter-button"
				:class="{ 'selected': filters.selectedCategories.includes(cat) }"
				@click="toggleCategory(cat)"
				>
				<span class="slider"></span>
				<span class="button-text">{{ cat }} ({{ categoryCounts[cat] }})</span>
			</button>
			<button
				v-if="filters.selectedCategories.length > 0"
				class="filter-button show-all"
				@click="filters.selectedCategories = []"
			>
				Remove filters
			</button>
			</div>
		</div>
		
		<!-- List of referrals -->
		<div class="list">
			<ul class="my-0 px-0">
				<li 
					v-for="(referral, index) in filteredReferrals" 
					:key="`${referral.id}-${filters.selectedCategories.join(',')}-${searchInput}`"
					class="referral-item"
					:style="{ animationDelay: index * 0.025 + 's' }"
				>
					<a :href="referral.link" target="_blank" rel="noopener noreferrer">
						<h4>{{ referral.category }}</h4>
						<h3>{{ referral.title }}</h3>
						<p v-if="referral.notes">{{ referral.notes }}</p>
					</a>
				</li>
			</ul>
		</div>
	</div>
  </div>
</template>

<script>
import Fuse from 'fuse.js';

export default {
	name: 'ReferralsList',

	data() {
	  return {
		searchInput: '',
		filters: {
			selectedCategories: []
		},
		referralsData: window.referralsData || [],
		sortAsc: false
	  };
	},

	computed: {
		appCategories() {
			return [...new Set(this.referralsData.map(referral => referral.category))].sort();
		},
		
		filteredReferrals() {
			let results = this.referralsData;

			if(this.searchInput) {
				const fuse = new Fuse(this.referralsData, {
					keys: ['title'],
					threshold: 0.3
				});
				results = fuse.search(this.searchInput).map(result => result.item)
			}

			results = results.filter(referral => {
				return (
					(!this.filters.selectedCategories.length || this.filters.selectedCategories.includes(referral.category))
				)
			});

			return results.sort((a, b) => a.title.localeCompare(b.title));
		},

		categoryCounts() {
			const counts = {};
			this.referralsData.forEach(referral => {
				counts[referral.category] = (counts[referral.category] || 0) + 1;
			});
			return counts;
		}
	},

	methods: {
		toggleCategory(category) {
			const index = this.filters.selectedCategories.indexOf(category);
			if (index > -1) {
				this.filters.selectedCategories.splice(index, 1);
			} else {
				this.filters.selectedCategories.push(category);
			}
		},

		alphabeticalReferrals(event) {
			this.sortAsc = event.target.checked;
		}
	}
};
</script>

<style scoped lang="scss">
	input {
		width: 100%;
		border-radius: 40px;
		border: none;
		background: #f0f0f0;
		padding: .5rem;
		padding-left: 1rem;
		position: relative;
		z-index: 1;
		transition: all 0.3s ease;
		
		&:focus {
			outline: none;
			background: #e8e8e8;
			box-shadow: 0 0 0 2px rgba(25, 121, 228, 0.2);
		}
	}

	.referrals-list {
		display: grid;
		grid-template-columns: 1fr 3fr;
		gap: 2rem;
		margin-block: 2rem;

		@media (max-width: 999px) {
			grid-template-columns: 1fr;
		}

		.filters {
			h2 {
				font-family: "Bitcount Prop Single", system-ui;
				font-size: 2rem;
				font-weight: 600;
				margin-bottom: 1rem;
				text-align: center;
			}
			
			.category-filters {
				display: flex;
				gap: 0.5rem;
				margin-top: 1rem;
				justify-content: center;
				flex-wrap: wrap;
				
				@media (min-width: 999px) {
					flex-direction: column;
				}
			}
			
			.show-all {
				margin-top: 1rem;
				padding: 0.5rem 1rem!important;
				border: 1px solid #dc3545!important;
				border-radius: 30px !important;
				background: #dc3545 !important;
				color: white;
				cursor: pointer;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				font-size: 0.9rem;
				text-align: center;
				width: auto;
				position: relative;
				overflow: hidden;
				transform: scale(1);
				text-align: center!important;
				text-transform: uppercase!important;
				width: 90%!important;
				
				&:hover {
					background: #c82333;
					border-color: #c82333;
					transform: scale(1.02);
					box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
				}
				
				&:active {
					transform: scale(0.98);
				}
			}
			
			.filter-button {
				padding: 0.5rem 1rem;
				border: 1px solid #ddd;
				border-radius: 30px;
				background: white;
				cursor: pointer;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				font-size: 0.9rem;
				text-align: left;
				width: auto;
				position: relative;
				overflow: hidden;
				transform: scale(1);
				
				&:hover:not(:disabled) {
					border-color: #1979e4;
				}
				
				&:active {
					transform: scale(0.98);
				}
				
				&.selected {
					color: white;
					border-color: #1979e4;
					box-shadow: 0 4px 12px rgba(25, 121, 228, 0.3);
					
					.slider {
						transform: translateX(0);
					}
				}
				
				.slider {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: linear-gradient(to right, #0da1e0, #1979e4, #004ca7);
					border-radius: 30px;
					transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					transform: translateX(-100%);
					z-index: 0;
				}
				
				.button-text {
					position: relative;
					z-index: 1;
					transition: color 0.3s ease;
				}
			}

			@media (min-width: 999px) {
				padding-right: 2rem;
				border-right: 1px solid #ccc;
			}
		}
		
		.list {
			ul {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 1rem;

				.referral-item {
					list-style: none;
					background: #fff;
					padding: 1.5rem;
					border: 1px solid #ddd;
					border-radius: 1rem;
					box-shadow:
						0 1px 1px hsl(0deg 0% 0% / 0.075),
						0 2px 2px hsl(0deg 0% 0% / 0.075);
					transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
					animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
					opacity: 0;
					transform: translateY(20px);
					
					&:hover {
						transform: translateY(-2px);
						box-shadow:
							0 2px 4px hsl(0deg 0% 0% / 0.1),
							0 4px 8px hsl(0deg 0% 0% / 0.1),
							0 8px 16px hsl(0deg 0% 0% / 0.1),
							0 24px 24px hsl(0deg 0% 0% / 0.1);
					}
					
					a {
						text-decoration: none;
						position: relative;

						h4 {
							color: #777;
							margin-bottom: 1rem;
							transition: color 0.3s ease;
						}
						
						h3 {
							font-weight: bold;
							color: #0E100F;
							font-size: 1.5rem;
							font-family: "Bitcount Prop Single", system-ui;
							font-optical-sizing: auto;
							font-weight: 600;
							transition: color 0.3s ease;
						}

						p {
							position: absolute;
							bottom: 0;
							right: 0;
							color: #777;
							font-size: 1rem;
							transition: color 0.3s ease;
						}
					}
				}

				@media (max-width: 649px) {
					grid-template-columns: 1fr;
				}
			}
		}
	}

@keyframes slideInUp {
	0% {
		opacity: 0;
		transform: translateY(20px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
</style> 

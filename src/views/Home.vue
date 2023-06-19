<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "../firebase/init.js";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

const posts = ref([]);
const isLoading = ref(true);
const selectedCat = ref("");
const currentPage = ref(1);
const pageSize = 8;
const router = useRouter();

const filteredPosts = computed(() => {
  return posts.value.filter((post) =>
    selectedCat.value === "all"
      ? true
      : post.category.includes(selectedCat.value)
  );
});

const pageCount = computed(() => {
  return Math.ceil(filteredPosts.value.length / pageSize);
});

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredPosts.value.slice(startIndex, endIndex);
});

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const postsLocal = [];

  querySnapshot.forEach((doc) => {
    const post = {
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      category: doc.data().category,
      createdAt: doc.data().createdAt,
      userId: doc.data().userId,
    };
    postsLocal.push(post);
  });
  posts.value = postsLocal;
  isLoading.value = false;
});

const editPost = (id) => {
  router.push(`/edit/${id}`);
};

const deletePost = (id) => {
  router.push(`/delete/${id}`);
};

const setPage = (page) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="container">
    <div class="search">
      <select
        name="category"
        id="category"
        v-model="selectedCat"
        class="search__input"
      >
        <option disabled value="">Select Category</option>
        <option value="all">All</option>
        <option v-for="post in posts" :value="post.category" :key="post.id">
          {{ post.category }}
        </option>
      </select>
    </div>

    <div class="card-row">
      <div class="card" v-for="post in paginatedPosts" :key="post.id">
        <!-- Card content -->
        <div class="container-btn">
          <button @click.prevent="editPost(post.id)">
            <Icon icon="mdi-light:pencil" width="20" color="green" />
          </button>
          <button @click.prevent="deletePost(post.id)">
            <Icon icon="mdi-light:delete" width="20" color="red" />
          </button>
        </div>
        <h3 class="card__title">Title: {{ post.title }}</h3>
        <p>Category: {{ post.category }}</p>
        <p class="card__content">Description: {{ post.description }}</p>

      </div>
    </div>

    <div class="pagination">
      <button
        v-for="page in pageCount"
        :key="page"
        @click="setPage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -10px;
}

.search {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.search__input {
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  transition: box-shadow 0.3s ease;
}

.search__input:focus {
  outline: none;
  box-shadow: 0 0 5px #7257fa;
}

.card-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.card {
  --border-radius: 0.75rem;
  --primary-color: #2980b9;
  --secondary-color: #3c3852;
  width: 300px;
  font-family: "Arial";
  padding: 1rem;
  cursor: pointer;
  border-radius: var(--border-radius);
  background: #dfdfe2;
  box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 3%);
  position: relative;
}

.card > * + * {
  margin-top: 1.1em;
}

.container-btn {
  display: flex;
  align-items: end;
  justify-content: end;
  gap: 10px;
}

.card__content {
  color: var(--secondary-color);
  font-size: 0.86rem;
}

.card__title {
  padding: 0;
  font-size: 1.3rem;
  font-weight: bold;
}


/* hover */
.card:hover .card__title {
  color: var(--primary-color);
}

.card:hover .card__arrow {
  background: #111;
}

.card:hover .card__arrow svg {
  transform: translateX(3px);
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  border: none;
  color: white;
  margin: 2px;
  background-color: #2980b9;
}

.pagination button.active {
  background-color: #111;
}
</style>

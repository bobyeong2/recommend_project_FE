// import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from '../stores/auth'

// // routes = URL 경로와 컴포넌트를 연결하는 배열
// // () => import(...) = 지연 로딩 (lazy loading)
// // 해당 페이지에 실제로 접근할 때만 파일을 불러옵니다
// // 앱 초기 로딩 속도가 빨라집니다
// const routes = [
//   {
//     path: '/',
//     redirect: '/movies'  // 루트 접속 시 영화 목록으로 리다이렉트
//   },
//   {
//     path: '/login',
//     component: () => import('../views/LoginView.vue'),
//     meta: { requiresGuest: true }  // 로그인한 사용자는 접근 불가
//   },
//   {
//     path: '/register',
//     component: () => import('../views/RegisterView.vue'),
//     meta: { requiresGuest: true }
//   },
//   {
//     path: '/movies',
//     component: () => import('../views/MovieListView.vue'),
//     meta: { requiresAuth: true }   // 로그인한 사용자만 접근 가능
//   },
//   {
//     path: '/movies/:id',  // :id = 동적 경로 파라미터 (/movies/42 → id = 42)
//     component: () => import('../views/MovieDetailView.vue'),
//     meta: { requiresAuth: true }
//   },
//   {
//     path: '/recommendations',
//     component: () => import('../views/RecommendView.vue'),
//     meta: { requiresAuth: true }
//   },
// ]

// const router = createRouter({
//   // createWebHistory() = URL에 # 없이 깔끔한 경로 사용
//   // 예) /#/movies 대신 /movies
//   history: createWebHistory(),
//   routes,
// })

// // 네비게이션 가드
// // 페이지 이동이 일어나기 전에 항상 실행됩니다
// // to: 이동할 페이지 / _from: 현재 페이지 (사용 안 해서 _ 접두사)
// // next: 이동을 최종 승인하는 함수
// router.beforeEach((to, _from, next) => {
//   // 라우터 가드 안에서 store를 사용할 때는
//   // 반드시 beforeEach 내부에서 호출해야 합니다
//   // (main.ts에서 pinia 등록 이후에 실행되도록)
//   const authStore = useAuthStore()

//   if (to.meta.requiresAuth && !authStore.isLoggedIn) {
//     // 인증이 필요한 페이지인데 로그인이 안 된 경우
//     next('/login')
//   } else if (to.meta.requiresGuest && authStore.isLoggedIn) {
//     // 게스트 전용 페이지인데 이미 로그인 된 경우
//     next('/movies')
//   } else {
//     next()  // 그 외 정상 이동
//   }
// })

// export default router
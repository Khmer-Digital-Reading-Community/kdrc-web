import DashboardLayout from "../layouts/DashboardLayout.vue";
import UserLayout from "../layouts/UserLayout.vue";
import Home from "../pages/user/Home.vue";
import LandingPage from "../pages/user/landingPage.vue";
import WritingPage from "../pages/user/WritingPage.vue";
import Community from "../pages/user/Community.vue";
import ExplorePage from "../pages/user/ExplorePage.vue";
import BookExchangeDetail from "../pages/user/BookExchangeDetail.vue";
import ExchangePage from "../pages/user/ExchangePage.vue";
import Reader from "../pages/user/Reader.vue";
import BookDetail from "../pages/user/BookDetail.vue";

export default [
  {
    path: "/",
    component: UserLayout,
    children: [
      { path: "", name: "landingpage", component: LandingPage },
      { path: "home", name: "homepage", component: Home },
      { path: "community", name: "community", component: Community },
      { path: "explore", name: "explore", component: ExplorePage },
      {
        path: "search",
        name: "search",
        component: () => import("../pages/user/SearchResults.vue"),
      },
      { path: "exchange", name: "exchange", component: ExchangePage },
      {
        path: "book-exchange-detail/:id",
        name: "book-exchange-detail",
        component: BookExchangeDetail,
      },
      {
        path: "about",
        name: "about",
        component: () => import("../pages/user/AboutUs.vue"),
      },
      { path: "book-detail/:id", name: "book-detail", component: BookDetail },
    ],
  },
  {
    path: "/:id/write",
    name: "writingpage",
    component: WritingPage,
  },
  {
    path: "/reading/:id",
    name: "readingpage",
    component: Reader,
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("../pages/user/Dashboard.vue"),
      },
      {
        path: "earnings",
        name: "earnings",
        component: () => import("../pages/user/EarningsPage.vue"),
      },
      {
        path: "analytics",
        name: "analytics",
        component: () => import("../pages/user/AnalyticsPage.vue"),
      },
      {
        path: "manuscripts",
        name: "manuscripts",
        component: () => import("../pages/user/Manuscripts.vue"),
      },
      {
        path: "books/new",
        name: "create-book",
        component: () => import("../pages/user/CreateBook.vue"),
      },
      {
        path: "bookmarks",
        name: "bookmarks",
        component: () => import("../pages/user/BookmarkPage.vue"),
      },
    ],
  },
  {
    // Sidebar links to /archive; redirect to manuscripts (archived status can be filtered there)
    path: "/archive",
    redirect: "/dashboard/manuscripts",
  },
];

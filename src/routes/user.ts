import DashboardLayout from "../layouts/DashboardLayout.vue";
import UserLayout from "../layouts/UserLayout.vue";
import Home from "../pages/user/Home.vue";
import LandingPage from "../pages/user/landingPage.vue";
import WritingPage from "../pages/user/WritingPage.vue";
import Community from "../pages/user/Community.vue";
import ExplorePage from "../pages/user/ExplorePage.vue";
// ExchangePage removed; use exchange-v2 route and redirect from /exchange
import Reader from "../pages/user/Reader.vue";
import BookDetail from "../pages/user/BookDetail.vue";
import BookExchangeDetail from "../pages/user/BookExchangeDetail.vue";

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
        meta: {
          hideNavbarSearch: true
        }
      },
      { path: "exchange", redirect: "/exchange-v2" },
      {
        path: "exchange-v2",
        name: "exchange-v2",
        component: () => import("../pages/user/Exchange_v2.vue"),
      },
      {
        path: "book-exchange-detail/:id",
        name: "book-exchange-detail",
        component: BookExchangeDetail,
      },
      {
        path: "book-exchange-detail-v2/:id",
        name: "book-exchange-detail-v2",
        component: () => import("../pages/user/BookExchangeDetail_v2.vue"),
      },
      {
        path: "about",
        name: "about",
        component: () => import("../pages/user/AboutUs.vue"),
      },
      {
        path: "faq",
        name: "faq",
        component: () => import("../pages/user/Faq.vue"),
      },
      {
        path: "contact",
        name: "contact",
        component: () => import("../pages/user/ContactUs.vue"),
      },
      {
        path: "privacy",
        name: "privacy",
        component: () => import("../pages/user/PrivacyPolicy.vue"),
      },
      {
        path: "terms",
        name: "terms",
        component: () => import("../pages/user/TermsOfService.vue"),
      },
      {
        path: "writers",
        name: "writers",
        component: () => import("../pages/user/Writers.vue"),
      },
      {
        path: "user/:id",
        name: "author-profile",
        component: () => import("../pages/user/AuthorProfile.vue"),
      },
      {
        path: "post-exchange",
        name: "post-exchange",
        component: () => import("../pages/user/ExchangeForm_v2.vue"),
      },
      {
        path: "exchange-v2/create",
        name: "exchange-v2-create",
        component: () => import("../pages/user/ExchangeForm_v2.vue"),
      },
      {
        path: "exchange-dashboard-v2",
        name: "exchange-dashboard-v2",
        component: () => import("../pages/user/exchangeDashboard_v2.vue"),
      },
      { path: "book-detail/:id", name: "book-detail", component: BookDetail },
      {
        path: "notifications",
        name: "notifications",
        component: () => import("../pages/user/NotificationsPage.vue"),
      },
      {
        path: "subscriptions",
        name: "subscriptions",
        component: () => import("../pages/user/SubscriptionPlans.vue"),
      },
    ],
  },
  {
    path: "/settings",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "settings",
        component: () => import("../pages/user/Settings.vue"),
      }
    ]
  },
  {
    path: "/settings/profile",
    component: DashboardLayout,
    children: [
      {
        path: "",
        name: "user-profile",
        component: () => import("../pages/user/Profile.vue"),
      }
    ]
  },
  {
    path: "/:id/write",
    name: "writingpage",
    component: WritingPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/reading/:id",
    name: "readingpage",
    component: Reader,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    meta: { requiresAuth: true },
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
        path: "exchange-dashboard-v2",
        name: "exchange-dashboard-v2",
        component: () => import("../pages/user/exchangeDashboard_v2.vue"),
      },
      {
        path: "bookmarks",
        name: "bookmarks",
        component: () => import("../pages/user/BookmarkPage.vue"),
      },
      {
        path: "reading-history",
        name: "reading-history",
        component: () => import("../pages/user/ReadingHistoryPage.vue"),
      },
      {
        path: "billing",
        name: "billing",
        component: () => import("../pages/user/PlanAndBilling.vue"),
      },
      {
        path: "billing/history",
        name: "billing-history",
        component: () => import("../pages/user/PaymentHistory.vue"),
      },
      {
        path: "manage-trade/:tradeId",
        name: "manage-trade",
        component: () => import("../pages/user/ManageTrade.vue"),
      },
    ],
  },
  {
    // Sidebar links to /archive; redirect to manuscripts (archived status can be filtered there)
    path: "/archive",
    redirect: "/dashboard/manuscripts",
  },
];

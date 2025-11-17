<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from "@/store/index";

// Main store and Router
const store = useMainStore();

// Auth composable
const { logout } = useAuth();
</script>

<template>
  <!-- Header -->
  <header id="page-header">
    <slot>
      <!-- Header Content -->
      <div class="content-header">
        <slot name="content">
          <!-- Left Section -->
          <div class="d-flex align-items-center">
            <slot name="content-left">
              <!-- Toggle Sidebar -->
              <button
                type="button"
                class="btn btn-sm btn-alt-secondary me-2 "
                @click="store.sidebarMini({ mode: 'toggle' })"
              >
                <i class="fa fa-fw fa-bars"></i>
              </button>
              <!-- END Toggle Sidebar -->
            </slot>
          </div>
          <!-- END Left Section -->

          <!-- Right Section -->
          <div class="d-flex align-items-center">
            <slot name="content-right">
              <!-- User Dropdown -->
              <div class="dropdown d-inline-block ms-2">
                <button
                  type="button"
                  class="btn btn-sm btn-alt-secondary d-flex align-items-center"
                  id="page-header-user-dropdown"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i class="fa fa-fw fa-user"></i>
                  <span class="d-none d-sm-inline-block ms-2">User</span>
                  <i
                    class="fa fa-fw fa-angle-down d-none d-sm-inline-block opacity-50 ms-1 mt-1"
                  ></i>
                </button>
                <div
                  class="dropdown-menu dropdown-menu-md dropdown-menu-end p-0 border-0"
                  aria-labelledby="page-header-user-dropdown"
                >
                  <div class="p-2">
                    <a
                      class="dropdown-item d-flex align-items-center justify-content-between"
                      href="javascript:void(0)"
                    >
                      <span class="fs-sm fw-medium">Manage Account</span>
                    </a>
                  </div>
                  <div role="separator" class="dropdown-divider m-0"></div>
                  <div class="p-2">
                    <a
                      class="dropdown-item d-flex align-items-center justify-content-between"
                      href="javascript:void(0)"
                      @click="logout"
                    >
                      <span class="fs-sm fw-medium">Logout</span>
                      <i class="fa fa-fw fa-sign-out-alt opacity-50 ms-1"></i>
                    </a>
                  </div>
                </div>
              </div>
              <!-- END User Dropdown -->
            </slot>
          </div>
          <!-- END Right Section -->
        </slot>
      </div>
      <!-- END Header Content -->


    </slot>
  </header>
  <!-- END Header -->
</template>

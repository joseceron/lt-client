<template>
  <div>    

    <h4>Company list</h4>
    <br />
    <!-- Fitlers -->
    <section>
      <!-- User Interface controls -->
      <b-row>       
        <b-col lg="4" class="my-1">
          <b-form-group
            label="Filtro"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input
                id="filter-input"
                v-model="filterText"
                type="search"
                placeholder="Escribe para buscar"
              ></b-form-input>

              <b-input-group-append>
                <b-button @click="setFilterText">Buscar</b-button>
              </b-input-group-append>

              <b-input-group-append>
                <b-button :disabled="!filterText" @click="cleantFilterText">Limpiar</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col lg="4" class="my-1">
          <b-form-group
            v-model="sortDirection"
            label="Filtrar por"
            description="Unselected to filter by all data"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-checkbox-group
              v-model="filterOn"
              :aria-describedby="ariaDescribedby"
              class="mt-1"
            >
              <b-form-checkbox value="nit">Nit</b-form-checkbox>
              <b-form-checkbox value="name">Name</b-form-checkbox>              
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>

         <b-col sm="5" md="4" class="my-1">
          <b-form-group
            label="Per page"
            label-for="per-page-select"
            label-cols-sm="6"
            label-cols-md="4"
            label-cols-lg="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="pageOptions"
              size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>

        <b-col sm="7" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </b-row>
    </section>

    <!-- table -->
    <section>
        <b-table
            :items="items"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :filter-included-fields="filterOn"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            stacked="md"
            show-empty
            small
            @filtered="onFiltered"
            :selectable="true"
            @row-clicked="rowClicked"
            >
            <template #cell(name)="row">
                {{ row.value }}
            </template>

            <!-- <template #cell(actions)="row">
                <b-button size="sm" @click="rowClicked(row.item, row.index, $event.target)" class="mr-1">Registrar pago</b-button>
                <b-button
                size="sm"
                @click="row.toggleDetails"
                >{{ row.detailsShowing ? 'Ocultar' : 'Ver' }} Detalle</b-button>
            </template>

            <template #row-details="row">
                <b-card>
                <b-row>                    
                    <b-col lg="12" md="12">
                        <div>
                            <strong>Id:</strong>
                            {{ row.item.id }}
                        </div>
                        <div>
                            <strong>Dirección:</strong>
                            {{ row.item.address }}
                        </div>
                        <div>
                            <strong>Celular:</strong>
                            {{ row.item.phone }}
                        </div>
                    </b-col>
                </b-row>
                </b-card>
            </template> -->
        </b-table>
    </section>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { companyApi } from "@/api/company-api";
import type { Company } from "@/models/company";

export default Vue.extend({
  name: "CompanyShowCaseIndex",
  data() {
    return {
      isFetching: false,
      error: null,
      showModalDetail: false,
      items: [],
      fields: [
        { key: "nit", label: "Nit" },
        { key: "name", label: "Name", sortable: true, sortDirection: "desc" },
        {
          key: "address",
          label: "Address",
          sortable: true,
          sortDirection: "desc",
        },
        { key: "phone", label: "Phone", sortable: true },
        { key: "actions", label: "Actions" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 150,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterText: null,
      filterOn: [],
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  created() {
    if (!this.$store.getters.isAuthenticated) {
      this.$router.replace("/pages/login");
    } else {
      this.fetchCompanies();
    }
  },
  methods: {
    fetchCompanies() {
      this.isFetching = true;
      const token = this.$store.getters.user.token;
      companyApi
        .fetch(token)
        .then((companies) => {
          this.items = companies;

          this.isFetching = false;
        })
        .catch((e) => {
          console.error;
          this.isFetching = false;
        });
    },
    onFiltered(filteredItems: any) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    rowClicked(item: any) {
      console.log('item clicked: ', item)
    },
    setFilterText(){
      this.filter = this.filterText
    },
    cleantFilterText(){
      this.filter = null
      this.filterText = null
    }
  },
});
</script>

<style lang="scss" scoped></style>

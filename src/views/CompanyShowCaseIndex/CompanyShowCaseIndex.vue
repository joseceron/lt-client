<template>
  <div>
    <h4>Company list</h4>
    <b-row v-if="isAdmin">
      <b-col offset-lg="8" lg="4" style="text-align: right">
        <b-button variant="outline-primary" size="sm" @click="downloadPDF()">
          <b-icon icon="cloud-download"></b-icon> Download
        </b-button>

        <b-button 
          variant="outline-primary" 
          size="sm" 
          @click="showModalCreate=true"
        >
          <b-icon icon="plus-lg"></b-icon> Add company
        </b-button>
      </b-col>
    </b-row>

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
                <b-button :disabled="!filterText" @click="cleantFilterText"
                  >Limpiar</b-button
                >
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

        <template #cell(actions)="row">
          <b-button
            variant="outline-danger"
            size="sm"
            v-if="isAdmin"
            @click="deleteItem(row.item, row.index, $event.target)"
          >
            <b-icon icon="x-circle"></b-icon>
          </b-button>

          <b-button
            variant="outline-primary"
            size="sm"
            v-if="isAdmin"
            @click="editItem(row.item, row.index, $event.target)"
          >
            <b-icon icon="pencil"></b-icon>
          </b-button>
        </template>
      </b-table>
    </section>

    <!-- edit -->
    <section v-if="companySelected != null">
      <b-modal
        title="Edit company"
        v-model="showModalEdit"
        no-close-on-backdrop
        hide-header-close
        size="md"
      >
        <div>
          <b-row>
            <b-col lg="12">
              <strong>Nit:</strong> {{companySelected.nit}}
            </b-col>

            <b-col lg="12">
              <b-form-group
                id="input-group-1"
                label="Name:"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="companySelected.name"
                  type="text"
                  placeholder="update name"
                  required
                ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col lg="12">
              <b-form-group
                id="input-group-1"
                label="Address:"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="companySelected.address"
                  type="text"
                  placeholder="update address"
                  required
                ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col lg="12">
              <b-form-group
                id="input-group-1"
                label="Phone:"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="companySelected.phone"
                  type="text"
                  placeholder="update phone"
                  required
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
        <template #modal-footer>
          <div class="w-100">
            <b-row>
              <b-col lg="6">
                <b-button size="md" variant="danger" @click="closeModal('edit')">
                  Cancelar
                </b-button>
              </b-col>
              <b-col lg="6">
                <b-button size="md" variant="warning" @click="submitEdit()">
                  Editar
                </b-button>
              </b-col>
            </b-row>
          </div>
        </template>
      </b-modal>
    </section>

    <!-- create -->
    <section>
      <b-modal
        title="Create company"
        v-model="showModalCreate"
        no-close-on-backdrop
        hide-header-close        
        size="md"
        header-bg-variant="light"
      >
        <div>
          <b-row>           
            <b-col lg="12">
              <b-form-group
                id="new-input-group-nit"
                label="Nit:"
                label-for="input-nit"
              >
                <b-form-input
                  id="input-nit"
                  v-model="newCompany.nit"
                  type="text"
                  placeholder="Insert nit"
                  required
                ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col lg="12">
              <b-form-group
                id="new-input-group-name"
                label="Name:"
                label-for="input-name"
              >
                <b-form-input
                  id="input-name"
                  v-model="newCompany.name"
                  type="text"
                  placeholder="Insert name"
                  required
                ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col lg="12">
              <b-form-group
                id="new-input-group-address"
                label="Address:"
                label-for="input-address"
              >
                <b-form-input
                  id="input-address"
                  v-model="newCompany.address"
                  type="text"
                  placeholder="Insert address"
                  required
                ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col lg="12">
              <b-form-group
                id="new-input-group-phone"
                label="Phone:"
                label-for="input-phone"
              >
                <b-form-input
                  id="input-phone"
                  v-model="newCompany.phone"
                  type="text"
                  placeholder="update phone"
                  required
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
        <template #modal-footer>
          <div class="w-100">
            <b-row>
              <b-col lg="6">
                <b-button size="md" variant="danger" @click="closeModal('create')">
                  Cancelar
                </b-button>
              </b-col>
              <b-col lg="6">
                <b-button size="md" variant="warning" @click="submitCreate()">
                  Crear
                </b-button>
              </b-col>
            </b-row>
          </div>
        </template>
      </b-modal>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { companyApi } from "@/api/company-api";
import type { Company } from "@/models/company";
import { jsPDF } from "jspdf"

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
      isAdmin: false,
      companySelected: null,
      showModalEdit: false,
      showModalCreate: false,
      token: '',
      newCompany: {
        nit: null,
        name: null,
        address: null,
        phone: null
      }
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
      this.token = this.$store.getters.user.token;
      this.fetchCompanies();
    }
  },
  methods: {
    fetchCompanies() {
      this.isFetching = true;
      const flag = this.$store.getters.user.isAdmin;
      if (flag === "true" || flag === true) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }

      companyApi
        .fetch(this.token)
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
      console.log("item clicked: ", item);
    },
    deleteItem(item: any) {
      console.log("item to delte: ", item);

      companyApi
        .del(this.token, item.nit)
        .then((response) => {
          this.fetchCompanies();
        })
        .catch((e) => {
          console.error;
        });
    },
    editItem(item: any) {
      this.companySelected = {...item};
      this.showModalEdit = true;
    },
    submitEdit() {
      companyApi
        .update(this.companySelected, this.token)
        .then((response) => {
          console.log('update response: ', response)
          this.showModalEdit = false
          alert('Edition completed successfully')
          this.fetchCompanies()
        })
        .catch((e) => {
          console.error
        })
    },
    submitCreate() {
      companyApi
        .create(this.newCompany, this.token)
        .then((response) => {
          console.log('new response: ', response)
          this.showModalCreate = false
          alert('Company created successfully')
          this.fetchCompanies()
        })
        .catch((e) => {
          alert(e)
        })
    },
    setFilterText() {
      this.filter = this.filterText;
    },
    cleantFilterText() {
      this.filter = null;
      this.filterText = null;
    },
    closeModal(modalName: string) {

      if (modalName === 'edit') {
        this.showModalEdit = false;
      } else if (modalName === 'create') {
        this.showModalCreate = false
      }
    },
    downloadPDF(){
      var headers = this.createHeaders([
        "nit",
        "name",
        "address",
        "phone",
      ]);

      var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "portrait" });
      doc.table(1, 1, this.items, headers, { autoSize: true });
      doc.save("companies.pdf");
    },
    createHeaders(keys: any) {
      var result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          nit: keys[i],
          name: keys[i],
          address: keys[i],
          phone: keys[i],
        });
      }
      return result;
    }
  },
});
</script>

<style lang="scss" scoped></style>

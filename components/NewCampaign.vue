<template>
  <div class="container">
    <template v-if="mode === 'choice'">
      <div class="section">
        <div class="section__title">
          <p>New Campaign</p>
          <span>Choose objective</span>
        </div>
        <div class="section__body">
          <div class="new-card" @click="changeMode('traffic')">
            <div class="svg-container">
              <img src="../static/traffic.png" alt />
            </div>

            <p>Drive traffic</p>
            <span>Create awareness</span>
          </div>

          <!--
          <div class="new-card">
            <div class="svg-container">
              <img src="../static/generate-leads.png" alt />
            </div>

            <p>Generate Leads</p>
            <span>Attract new customers</span>
          </div>-->
          <div class="new-card" @click="changeMode('sell')">
            <div class="svg-container">
              <img src="../static/generate-sales.png" alt />
            </div>

            <p>Sell Product</p>
            <span>Sell a product</span>
          </div>

          <div class="new-card" @click="changeMode('reservations')">
            <div class="svg-container">
              <img src="../static/reservations.svg" alt />
            </div>

            <p>Host Reservations</p>
            <span>Typically for restaurants, hotels, etc</span>
          </div>

          <div class="new-card" @click="changeMode('reservations')">
            <div class="svg-container">
              <img src="../static/service-bookings.svg" alt />
            </div>

            <p>Service Bookings</p>
            <span>Typically for service providers</span>
          </div>
        </div>
      </div>
      <!--
            <div class="section" v-if="drafts && drafts.length">
                <div class="section__title section__title--drafts">
                    <p>Pick up from where you left off</p>
                </div>

                <div class="section__body">
                    <div class="draft draft-card" v-for="(draft, index) in drafts" :key="index">
                        <div class="draft-card__header">
                            <p>Draft</p>
                            <button>Remove</button>
                        </div>
                        <div class="draft-card__body">

                            <p>{{}}</p>
                            <p>Last edited: Nov 12, 2022</p>
                        </div>
                    </div>
                   
                    
                </div>
      </div>-->
    </template>

    <template v-if="mode === 'traffic'">
      <PayPerClickCampaign />
    </template>

    <template v-if="mode === 'sell'">
      <PayPerSaleCampaign />
    </template>
  </div>
</template>





<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

import continents from "../continents"; //'../../continents'
import countries from "../countries";

import NewCampaign from "../components/NewCampaign"; //'../../../components/NewCampaign';
import CurrencyMoneyInput from "../components/inputs/CurrencyMoneyInput";

import PayPerSaleCampaign from "../components/PayPerSaleCampaign";
import PayPerClickCampaign from "../components/PayPerClickCampaign";
import SelectCountriesInput from "../components/inputs/SelectCountriesInput";
export default {
  components: {
    SelectCountriesInput,
    CurrencyMoneyInput,
    DatePicker,
    PayPerSaleCampaign,
    PayPerClickCampaign
  },
  computed: {
    drafts() {
      return (
        (window.localStorage.getItem("drafts") &&
          JSON.stringify(window.localStorage.getItem("drafts"))) ||
        []
      );
    }
  },
  data() {
    return {
      extraInfos: {
        budget: {
          text:
            "This is the amount of money you're committing to the campaign. Marketers get paid from this budget. When your budget is exhausted, your campaign is put on hold",
          visible: false
        },
        marketers_required: {
          text: "Default: unlimited",
          visible: false
        },
        who_can_join: {
          text:
            "Anyone: anyone on Afflee can join. Invited marketers: this campaign won't be publicly listed and will be only accessible to people you invite. Applicants: this allows you to screen interested marketers",
          visible: false
        },
        recurring_links: {
          text:
            "Default is 'NO'. 'YES' is best suited to publications/websites that create content regularly",
          visible: false
        },
        trying_to_create: {
          // text:`A form without`
        }
      },
      mode: "choice",
      step: 1,
      canCreateCampaign: false,
      selectedContinents: [],
      continents: continents,
      countries,
      success_message: "",
      errors: {
        title: "",
        description: "",
        budget: "",
        ends_at: "",
        who_can_join: "",
        application_questions: ""
      },
      link_errors: [""],
      can_continue: true,
      campaign: {
        title: "",
        description: "",
        budget: "",
        links_to_advertise: [{ link: "", pay_per_click: "", advert_note: "" }],
        join_by_invite: 0,
        payment_models: [],
        ends_at: "",
        thumbnail: "",
        countries_allowed: [],
        recurring_links: "",
        who_can_join: null,
        pay_currency: "NGN",
        conversion_media: [],
        application_questions: [""],
        categories: ["", ""],

        products: {
          hosted: "",
          list: [{}]
        }
      },
      template: {
        payment_models: ["Pay per click", "Pay per lead", "Pay per sale"]
      },
      loading: false,
      product_template: {
        name: "",
        description: "",
        marketer_commission: "",
        marketer_commission_type: "",
        thumbnail: "",
        images: [],
        advert_note: "",
        delivery_details: {},
        variation_details: {},
        meta: {},
        qty: {},
        unit_price: 0,
        currency: "",
        discount: 0,
        discount_type: ""
        //refund_details:
      },

      draftId: this.$route.query["draft"] || ""
    };
  },
  mounted() {
    if (!this.draftId) {
      this.draftId = Date.now();
    }

    // save every 2 seconds
  },
  methods: {
    autoSave() {
      if (this.mode === "choice") return;
      console.log("autosaving");
      let draft = {
        id: this.draftId,
        campaign: this.campaign
      };
      let drafts =
        (window.localStorage.getItem("drafts") &&
          JSON.parse(window.localStorage.getItem("drafts"))) ||
        [];

      const draft_exists = drafts.find(d => d.id === this.draftId);
      if (draft_exists) {
        const index = drafts.indexOf(draft_exists);
        drafts[index] = draft;
      } else {
        drafts.push(draft);
      }
      drafts = JSON.stringify(drafts);
      window.localStorage.setItem("drafts", drafts);
    },
    changeMode(mode) {
      this.mode = mode;
      if (this.mode == "reservations") {
        this.$router.push("/dashboard/campaigns/new/reservations");
      }
    },
    showGeneralDetails() {
      this.show_general_details = !this.show_general_details;
    },
    addConversionMedia(medium) {
      const index = this.campaign.conversion_media.find(a => a === medium);
      if (index) {
        this.campaign.conversion_media.splice(index, 1);
      } else {
        this.campaign.conversion_media.push(medium);
      }
    },
    previousStep() {
      if (this.mode === "click") {
        if (this.step > 1) {
          this.step--;
        } else {
          this.step = null;
          this.mode = "choice";
        }
      }
    },
    nextStep() {
      if (this.mode === "click") {
        let can_continue = true;
        if (this.step < 4) {
          if (this.step === 1) {
            const req_labels = ["title", "description", "budget"];

            for (let i = 0; i < req_labels.length; i++) {
              const key = req_labels[i];
              if (!this.campaign[key]) {
                this.errors[key] = `${key} cannot be empty`;
                //return;
                can_continue = false;
              } else {
                this.errors[key] = "";
              }
            }
          } else if (this.step === 2) {
            Object.keys(this.link_errors).forEach(key => {
              this.link_errors[key] = "";
            });
            this.campaign.links_to_advertise.forEach((link, index) => {
              if (!link.link || !link.pay_per_click || !link.advert_note) {
                this.$set(this.link_errors, index, "Please enter all fields");
                can_continue = false;
              } else if (
                !link.link.match(
                  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
                )
              ) {
                this.$set(
                  this.link_errors,
                  index,
                  "Please provide a valid URL"
                );
                can_continue = false;
              } else if (link.pay_per_click < 0) {
                this.$set(
                  this.link_errors,
                  index,
                  "Cost cannot be less than 0"
                );
                can_continue = false;
              }
            });
          } else if (this.step === 3) {
            this.errors["who_can_join"] = "";
            if (!this.campaign.who_can_join) {
              can_continue = false;
              this.errors["who_can_join"] =
                "Please choose who can join this campaign";
            }
          } else if (this.step === 4) {
            this.errors["countries_allowed"] = "";
            if (!this.countries_allowed) {
              this.errors["countries_allowed"] = "Please choose countries";
            }
          }
          if (can_continue) {
            this.step++;
          }
        }
      } else if (this.mode === "sales-lead") {
        this.step++;
      }
    },
    setInfoVisibility(info) {
      if (this.extraInfos[info]) {
        this.extraInfos[info].visible = !this.extraInfos[info].visible;
      }
      //this.extraInfos[info].visibility = !this.
    },
    /*changeMode(mode) {
      this.mode = mode;
      this.step = 1;
    },*/
    addPaymentModel(model) {
      if (this.campaign.payment_models.find(a => a === a)) {
        // index
        const index = this.campaign.payment_models.indexOf(model);
        this.campaign.payment_models.splice(index, 1);
        return;
      }
      this.campaign.payment_models.push(model);
    },
    setCostPerClick(meta) {
      this.campaign.links_to_advertise[meta.index].pay_per_click = meta.value;
    },
    setCampaignBudget(value) {
      this.campaign.budget = value;
    },
    setCountriesAllowed(value) {
      this.campaign.countries_allowed = value;
    },
    addQuestion() {
      this.campaign.application_questions.push("");
    },
    removeQuestion(index) {
      this.campaign.application_questions.splice(index, 1);
    },
    checkCountry(country) {
      if (this.campaign.countries_allowed.includes(country)) {
        this.campaign.countries_allowed.splice(
          this.campaign.countries_allowed.indexOf(country),
          1
        );
      } else {
        if (!this.campaign.countries_allowed.includes(country)) {
          this.campaign.countries_allowed.push(country);
        }
      }
    },
    createCampaign() {
      this.validateSteps();

      if (this.can_continue) {
        this.campaign.recurring_links = this.campaign.recurring_links
          ? parseInt(this.campaign.recurring_links)
          : "";
        const payload = this.campaign;
        this.loading = true;
        this.$api
          .post("/campaigns", payload)
          .then(resp => {
            this.loading = false;
            this.$router.push("/dashboard/campaigns");
            this.$store.dispatch("dashboard/actionShowSuccessToast", {
              message: "Campaign was successfully created"
            });
          })
          .catch(err => {
            this.loading = false;
            const error = (err.response && err.response.data.data) || err;
            this.$store.dispatch("dashboard/actionShowErrorToast", {
              message: err
            });
          });
      } else {
        this.$store.dispatch("dashboard/actionShowErrorToast", {
          message: "Errors Exist. Please see form"
        });
      }
    },
    addThumbnail() {
      const input = document.getElementById("imagefile");
      const file = input.files && input.files[0];
      const vm = this;

      const cloudinary_url =
        "https://api.cloudinary.com/v1_1/dx9vdtrxz/image/upload";
      try {
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        const vm = this;

        xhr.open("POST", cloudinary_url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        xhr.onreadystatechange = function(e) {
          if (xhr.readyState == 4 && xhr.status == 200) {
            // File uploaded successfully
            var response = JSON.parse(xhr.responseText);
            // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
          }

          //const displayElement = document.createElement('img');
          //displayElement.src = response.secure_url
          //editor.append(displayElement)
          vm.campaign.thumbnail = response.secure_url;
        };

        fd.append("upload_preset", "jljh5lxc");
        fd.append("tags", "browser_upload"); // Optional - add tag for image admin in Cloudinary
        fd.append("file", file);
        xhr.send(fd);
      } catch (e) {
        console.log(e);
      }
    },
    chooseContinent(continent) {
      //alert(continent)
      if (!this.selectedContinents.includes(continent)) {
        this.selectedContinents.push(continent);
        this.checkContinentCountries(continent);
      } else {
        const index = this.selectedContinents.indexOf(continent);
        this.selectedContinents.splice(index, 1);
        this.checkContinentCountries(continent, true);
      }
    },
    checkContinentCountries(continent, uncheck = false) {
      let countries_object = continents[continent];
      let countries = [];

      Object.keys(countries_object).forEach(country_code => {
        //countries.push(countries_object[country_code])
        let country = countries_object[country_code];

        if (uncheck) {
          if (this.campaign.countries_allowed.includes(country)) {
            this.campaign.countries_allowed.splice(
              this.campaign.countries_allowed.indexOf(country),
              1
            );
          }
        } else {
          if (!this.campaign.countries_allowed.includes(country)) {
            this.campaign.countries_allowed.push(country);
          }
        }
        if (document.getElementById("choice_" + country_code)) {
          document.getElementById("choice_" + country_code).checked =
            uncheck === false ? true : false;
        }
      });

      /* countries.forEach(country => {
                country = country.toLowerCase();
                
            })*/
    },

    removeLink(index) {
      this.campaign.links_to_advertise.splice(index, 1);
      this.link_errors.splice(index, 1);
    },

    addLink() {
      this.campaign.links_to_advertise.push({
        link: "",
        pay_per_click: "",
        advert_note: ""
      });
      this.link_errors.push("");
    },
    validateSteps() {
      // clear errors first =

      Object.keys(this.errors).forEach(key => {
        this.errors[key] = "";
      });

      Object.keys(this.link_errors).forEach(key => {
        this.link_errors[key] = "";
      });

      this.can_continue = true;

      const fields = {
        1: ["title", "description", "budget", "ends_at"]
      };
      for (let i = 0; i < fields[1].length; i++) {
        const key = fields[1][i];
        if (!this.campaign[key]) {
          this.errors[key] = `${key} cannot be empty`;
          this.can_continue = false;
        } else {
          this.errors[key] = "";
        }
      }

      this.validateStep2();

      this.validateStep3();
    },

    validateStep2() {
      let can_continue = true;
      this.campaign.links_to_advertise.forEach((link, index) => {
        if (!link.link || !link.pay_per_click || !link.advert_note) {
          //alert(link)
          this.$set(this.link_errors, index, "Please enter all fields");
          //this.link_errors[index] =  "Please enter all fields for all links"
          //if (!this.link_errors[index]) this.link_errors[index] = ""
          //this.link_errors[index] =   "Please enter all fields"
          this.can_continue = false;
        } else if (
          !link.link.match(
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
          )
        ) {
          this.$set(this.link_errors, index, "Please provide a valid URL");
        } else if (link.pay_per_click < 0) {
          this.$set(this.link_errors, index, "Cost cannot be less than 0");
        }
      });

      return can_continue;
    },
    validateStep3() {
      // privacy;
      // sanitize

      if (!this.campaign.who_can_join) {
        this.errors.who_can_join = "Please select who can join";
        this.can_continue = false;
        return;
      }
      if (
        this.campaign.who_can_join !== 2 &&
        this.campaign.who_can_join !== "2"
      ) {
        this.campaign.application_questions = [""];
        return true;
      } else if (this.campaign.application_questions[0] === "") {
        this.errors.application_questions =
          "Please enter at least one question to ask applicatnts";
        this.can_continue = false;
        return;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.red {
  color: red;
}
.radio-label {
  position: relative;

  display: flex;
  padding: 8px 8px;
  align-items: center;
  border: 1px solid #d6d6e7;
  border-radius: 3px;
  margin-right: 8px;
  box-shadow: inset 0 1px 4px 0 rgb(227 160 158 / 20%);
  transition: all 100ms ease-in-out;
  height: 50px;

  //background: none !important;

  //border: 1px solid grey;

  &:hover {
    background: rgba(211, 211, 211, 0.382);
  }
  &:focus-within {
    //background: lightgray;
  }
  input {
    cursor: pointer;
    border: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    background: none !important;
  }

  .radio-indicator {
    width: 20px;
    height: 20px;
    margin-right: 16px;
    border-radius: 50%;
    background: lightgrey;
    display: block;
  }
  .radio-text {
    font-size: 14px;
    font-weight: 400;
  }

  input:checked + .radio-indicator {
    background: $primary;
  }
}
.error {
  font-size: 12px;
  color: red;
}
.create-container {
  //border: 1px solid grey;
  display: flex;
  justify-content: flex-end;
  margin-left: 55px;
  width: 100%;

  button {
    @include largebutton;
    width: 200px;
    padding: 8px;
    border-radius: 4px;
  }
}
.container {
  width: 60%;
  padding: 75px 24px;
  margin: auto;

  @include media("<=t") {
    width: 90%;
  }
}

.section {
  &__title {
    color: lightgrey;
    font-size: 25px;
    text-align: center;
    margin-bottom: 16px;
    //margin-bottom: 16px;

    span {
      font-size: 16px;
      color: $charcoal;
      margin-top: 16px;
      font-weight: 400;
      color: $faint;
    }

    &--drafts {
      margin-top: 50px;
    }
  }
  &__body {
    display: grid;
    grid-template-columns: 49%49%;
    justify-content: space-between;
  }
}

.flex-row {
  display: grid;
  grid-template-columns: 30% 30% 30%;

  width: 100%;

  &--w-50 {
    grid-template-columns: 49% 49% !important;
    .checkbox-label {
      input {
        width: 20% !important;
      }
    }
  }
}

.bold-label {
  font-weight: 600;
}

.checkbox-label {
  display: flex;
  align-items: center;
  margin-right: 16px;
  position: relative;
  border-radius: 10px;
  //padding: 4px 8px;
  font-weight: 300 !important;
  background: white;
  //border: 1.5px solid rgba(169, 169, 169, 0.64);
  //border: 1.5px solid #ced4da58 !important;
  //border: 1px solid rgba(169, 169, 169, 0.64) !important;

  margin-bottom: 5px;

  input {
    margin-right: 8px;
    min-height: 20px !important;
    appearance: auto !important;
    width: 10% !important;
  }
}
.new-card {
  height: auto;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  box-shadow: 0 0.8rem 2rem rgb(90 97 129 / 5%);
  //padding: 16px;
  border: 1.5px solid rgba(211, 211, 211, 0.442);
  background: white !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
  margin-bottom: 20px;
  &:hover {
    border: 1px solid $lightaccent;
  }
  //margin-top: 50px;

  .svg-container {
    width: 50%;
    margin: auto;
    margin-bottom: 8px;
  }

  p {
    color: $charcoal;
    font-size: 18px;
    text-align: center;
  }

  span {
    color: darkgrey;
    font-size: 13px;
    text-align: center;
  }
}
.draft-card {
  cursor: pointer;

  height: auto;
  border-radius: 5px;
  width: 100%;
  box-shadow: 0 0.8rem 2rem rgb(90 97 129 / 5%);
  //padding: 16px;
  border: 1.5px solid rgba(211, 211, 211, 0.442);
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 24px;

  &__body {
    // height: 200px;
    padding: 8px 0px;
    color: $charcoal;
    p {
      &:first-of-type {
        font-weight: 700;
      }
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    //border-bottom: 0.5px solid rgba(211, 211, 211, 0.368);
    button {
      @include editbutton;
      width: auto;
      border: 0.5px solid lightgray;
      color: lightgray;
      height: auto;
      min-height: auto;
      padding: 2px 5px;
    }

    p {
      color: $charcoal;
      font-size: 16px !important;
      text-transform: none;
      font-weight: 700;
      display: block;
      width: 100%;
    }
  }
}

.traffic {
  width: 100%;
  margin: auto;
}
.center {
  width: 100%;
  text-align: center;
  color: $charcoal;
  font-size: 20px;
  margin-left: 50px;
  margin-bottom: 50px;
}
.add-link {
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
  button {
    //background: $lightaccent;
    color: $primary;
    display: block;
    border-radius: 4px;
    padding: 8px;
  }
}
.advert-link {
  display: flex;
  flex-direction: column;
  border: 0.5px solid rgba(211, 211, 211, 0.442);
  padding: 10px;
  &-head {
    display: flex;
    justify-content: flex-end;

    span {
      color: $lightaccent;
      cursor: pointer;
    }
  }
}

.half {
  display: flex;
  justify-content: space-between;
  width: 100% !important;
  .form-input {
    width: 100% !important;

    input,
    select,
    textarea {
      width: 98% !important;
    }

    input[type="radio"] {
      width: 50px !important;
      height: 50px;
    }
  }
}

.form {
  margin-top: 30px;
  &__container {
    padding: 16px 24px;
  }
}

.form-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  &:deep(.mx-datepicker) {
    height: 50px !important;
    width: 98%;
  }
  &:deep(.mx-input-wrapper) {
    height: 50px !important;
  }
  &:deep(.mx-input) {
    height: 50px !important;
  }

  label {
    font-size: 15px;
    color: $charcoal;
    font-weight: 600;
    margin-bottom: 5px;
  }

  input,
  select,
  textarea {
    display: inline-block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    padding: 6px 30px;
    padding-left: 10px;
    font-size: 15px;
    line-height: 1.4;
    color: $charcoal;
    background-color: #fff;
    //border: 1px solid #ccc;
    border: 2px solid rgba(211, 211, 211, 0.442);

    border-radius: 4px;

    outline-color: rgba(229, 231, 235);
  }

  textarea {
    height: 200px;
  }
}

.steps {
  width: 100%;
  display: relative;
  /*
    &:after {
        content: "";
        position: absolute;
        width: 3px;
        background-color: #fff;
        top: 0;
        background: rgb(90 97 129 / 5%);
        border-radius: 6px;
        z-index: -1;
        bottom: 0;
        height: 100%;
        margin-top: 150px;;
    }*/

  &__step {
    margin-bottom: 20px;

    position: relative;
    cursor: pointer;
    min-height: 100px;
    border-radius: 5px;
    width: 100%;

    box-shadow: 0 0.8rem 2rem rgb(90 97 129 / 5%);
    //padding: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    //padding: 24px;
    margin-left: 50px;

    /*&:after {
                content: "";
                position: absolute;
                width: 6px;
                background-color: #fff;
                top: 0;
                left: -2px;
                background: #03ca6f;
                border-radius: 6px;
                z-index: -1;
            }*/

    &__body {
      padding-bottom: 24px;
    }
    &__header {
      color: $charcoal;
      font-weight: 400;
      border-bottom: 1px solid rgba(26, 26, 26, 0.1) !important;
      //padding-bottom: 16px;
      &__container {
        padding: 24px;
      }
      span {
        color: $faint;
        font-weight: 300;
        font-size: 12px !important;
      }
    }

    .step-card {
    }
  }
}

.form-input-file {
  position: relative;
  input {
  }
}
</style>
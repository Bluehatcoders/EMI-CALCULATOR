Vue.filter("formatNumber", function (value) {
			return numeral(value).format("0,00,000.00"); 
		});

		Vue.filter("inWords", function (value) {
			return price_in_words(value);
		});

		new Vue({
			el: '#emicalc',
			data: {
				loan_amount: this.$cookies.isKey('loan_amount')?this.$cookies.get('loan_amount'):100000,
				loan_range_step:this.$cookies.isKey('loan_range_step')?this.$cookies.get('loan_range_step'):100000,
				loan_input: 'text',
				min: 100000,
				max: 1000000,
				tenure_type: this.$cookies.isKey('tenure_type')?this.$cookies.get('tenure_type'):2,
				max_tenure: (this.tenure_type == 1)?360:(this.tenure_type == 2)?30:90,
				interest_type: this.$cookies.isKey('interest_type')?this.$cookies.get('interest_type'):1,
				interest: this.$cookies.isKey('interest')?this.$cookies.get('interest'):12,
				tenure: this.$cookies.isKey('tenure')?this.$cookies.get('tenure'):1,
				emi: undefined,
				total_interest: undefined,
				tenure_in_months: undefined
			},
			created: function () {
				this.calculateEMI();
			},
			watch: {
				loan_amount: function (val) {
				//this.loan_amount = this.$options.filters.formatNumber(val);
				this.calculateEMI();
				this.$cookies.set('loan_amount', val);
			},
			tenure: function (val) {
				this.calculateEMI();
				this.$cookies.set('tenure', val);
			},
			interest: function(val) {
				this.calculateEMI();
				this.$cookies.set('interest', val);
			},
			tenure_type: function(val) {
				this.calculateEMI();	
				this.$cookies.set('tenure_type', val);
			},
			interest_type: function(val) {
				this.calculateEMI();
				this.$cookies.set('interest_type', val);
			},
			loan_range_step: function(val) {
				this.$cookies.set('loan_range_step', val);
			}
		},
		methods: {
			calculateEMI() {
				
				if(this.tenure_type == 2) {
					term = this.tenure*12;
				}
				else {
					term = this.tenure;
				}
				this.tenure_in_months = term;
				if(this.interest_type == 1) {
					if(this.tenure_type == 3)
						interest = this.interest/36500;
					else
						interest = this.interest/1200;
					let top = Math.pow((1+interest),term);
					let bottom = top - 1;
					let ratio = top/bottom;
					let principal = (this.loan_amount/term).toFixed(2);
					this.emi = (this.loan_amount * interest * ratio).toFixed(2);
					this.total_interest = ((this.emi - principal)*term).toFixed(2);
				} else {
					if(this.tenure_type == 3)
						this.total_interest = (this.loan_amount * this.interest/36500 * term).toFixed(2);
					else
						this.total_interest = (this.loan_amount * this.interest/1200 * term).toFixed(2);

					this.emi = ((parseFloat(this.loan_amount) + parseFloat(this.total_interest))/term).toFixed(2);
				}
				
			}
		}
	})

		function price_in_words(price) {
			var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
			dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
			tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
			handle_tens = function(dgt, prevDgt) {
				return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
			},
			handle_utlc = function(dgt, nxtDgt, denom) {
				return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
			};

			var str = "",
			digitIdx = 0,
			digit = 0,
			nxtDigit = 0,
			words = [];
			if (price += "", isNaN(parseInt(price))) str = "";
			else if (parseInt(price) > 0 && price.length <= 10) {
				for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) switch (digit = price[digitIdx] - 0, nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0, price.length - digitIdx - 1) {
					case 0:
					words.push(handle_utlc(digit, nxtDigit, ""));
					break;
					case 1:
					words.push(handle_tens(digit, price[digitIdx + 1]));
					break;
					case 2:
					words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2] ? " and" : "") : "");
					break;
					case 3:
					words.push(handle_utlc(digit, nxtDigit, "Thousand"));
					break;
					case 4:
					words.push(handle_tens(digit, price[digitIdx + 1]));
					break;
					case 5:
					words.push(handle_utlc(digit, nxtDigit, "Lakh"));
					break;
					case 6:
					words.push(handle_tens(digit, price[digitIdx + 1]));
					break;
					case 7:
					words.push(handle_utlc(digit, nxtDigit, "Crore"));
					break;
					case 8:
					words.push(handle_tens(digit, price[digitIdx + 1]));
					break;
					case 9:
					words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? " and" : " Crore") : "")
				}
				str = words.reverse().join("")
			} else str = "";
			return str + " Rupees Only";
		}
/**
 * Created with JetBrains WebStorm.
 * User: hermenegildoromero
 * Date: 27/10/13
 * Time: 08:38
 * To change this template use File | Settings | File Templates.
 */

angular.module('countrySelect', [])
    .directive('countrySelect', ['$parse', function ($parse) {
        var countries = [
            "Afghanistan", "Aland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola",
            "Anguilla", "Antarctica", "Antigua And Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria",
            "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
            "Bermuda", "Bhutan", "Bolivia, Plurinational State of", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina",
            "Botswana", "Bouvet Island", "Brazil",
            "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
            "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China",
            "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo",
            "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba",
            "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
            "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)",
            "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia",
            "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece",
            "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea",
            "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City State)",
            "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Republic of", "Iraq",
            "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya",
            "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan",
            "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
            "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia, The Former Yugoslav Republic Of",
            "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique",
            "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of",
            "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
            "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger",
            "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau",
            "Palestinian Territory, Occupied", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
            "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation",
            "Rwanda", "Saint Barthelemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia",
            "Saint Martin (French Part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
            "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
            "Sint Maarten (Dutch Part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
            "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
            "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic",
            "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-Leste",
            "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
            "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
            "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu",
            "Venezuela, Bolivarian Republic of", "Viet Nam", "Virgin Islands, British", "Virgin Islands, U.S.",
            "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
        ];

        return {
            restrict: 'E',
            template: '<select><option>' + countries.join('</option><option>') + '</option></select>',
            replace: true,
            link: function (scope, elem, attrs) {
                if (!!attrs.ngModel) {
                    var assignCountry = $parse(attrs.ngModel).assign;

                    elem.bind('change', function (e) {
                        assignCountry(elem.val());
                    });

                    scope.$watch(attrs.ngModel, function (country) {
                        elem.val(country);
                    });
                }
            }
        };
    }]);


/*
 <select name="vend_outlet[outlet_contact][physical_country_id]" id="vend_outlet_outlet_contact_physical_country_id">
 <option value="" selected="selected">Country</option>
 <option value="AF">Afghanistan</option>
 <option value="AX">Åland Islands</option>
 <option value="AL">Albania</option>
 <option value="DZ">Algeria</option>
 <option value="AS">American Samoa</option>
 <option value="AD">Andorra</option>
 <option value="AO">Angola</option>
 <option value="AI">Anguilla</option>
 <option value="AQ">Antarctica</option>
 <option value="AG">Antigua and Barbuda</option>
 <option value="AR">Argentina</option>
 <option value="AM">Armenia</option>
 <option value="AW">Aruba</option>
 <option value="AU">Australia</option>
 <option value="AT">Austria</option>
 <option value="AZ">Azerbaijan</option>
 <option value="BS">Bahamas</option>
 <option value="BH">Bahrain</option>
 <option value="BD">Bangladesh</option>
 <option value="BB">Barbados</option>
 <option value="BY">Belarus</option>
 <option value="BE">Belgium</option>
 <option value="BZ">Belize</option>
 <option value="BJ">Benin</option>
 <option value="BM">Bermuda</option>
 <option value="BT">Bhutan</option>
 <option value="BO">Bolivia</option>
 <option value="BA">Bosnia and Herzegovina</option>
 <option value="BW">Botswana</option>
 <option value="BV">Bouvet Island</option>
 <option value="BR">Brazil</option>
 <option value="IO">British Indian Ocean Territory</option>
 <option value="VG">British Virgin Islands</option>
 <option value="BN">Brunei</option>
 <option value="BG">Bulgaria</option>
 <option value="BF">Burkina Faso</option>
 <option value="BI">Burundi</option>
 <option value="KH">Cambodia</option>
 <option value="CM">Cameroon</option>
 <option value="CA">Canada</option>
 <option value="CV">Cape Verde</option>
 <option value="KY">Cayman Islands</option>
 <option value="CF">Central African Republic</option>
 <option value="TD">Chad</option>
 <option value="CL">Chile</option>
 <option value="CN">China</option>
 <option value="CX">Christmas Island</option>
 <option value="CC">Cocos [Keeling] Islands</option>
 <option value="CO">Colombia</option>
 <option value="KM">Comoros</option>
 <option value="CG">Congo - Brazzaville</option>
 <option value="CD">Congo - Kinshasa</option>
 <option value="CK">Cook Islands</option>
 <option value="CR">Costa Rica</option>
 <option value="CI">Côte d’Ivoire</option>
 <option value="HR">Croatia</option>
 <option value="CU">Cuba</option>
 <option value="CY">Cyprus</option>
 <option value="CZ">Czech Republic</option>
 <option value="DK">Denmark</option>
 <option value="DJ">Djibouti</option>
 <option value="DM">Dominica</option>
 <option value="DO">Dominican Republic</option>
 <option value="EC">Ecuador</option>
 <option value="EG">Egypt</option>
 <option value="SV">El Salvador</option>
 <option value="GQ">Equatorial Guinea</option>
 <option value="ER">Eritrea</option>
 <option value="EE">Estonia</option>
 <option value="ET">Ethiopia</option>
 <option value="QU">European Union</option>
 <option value="FK">Falkland Islands</option>
 <option value="FO">Faroe Islands</option>
 <option value="FJ">Fiji</option>
 <option value="FI">Finland</option>
 <option value="FR">France</option>
 <option value="GF">French Guiana</option>
 <option value="PF">French Polynesia</option>
 <option value="TF">French Southern Territories</option>
 <option value="GA">Gabon</option>
 <option value="GM">Gambia</option>
 <option value="GE">Georgia</option>
 <option value="DE">Germany</option>
 <option value="GH">Ghana</option>
 <option value="GI">Gibraltar</option>
 <option value="GR">Greece</option>
 <option value="GL">Greenland</option>
 <option value="GD">Grenada</option>
 <option value="GP">Guadeloupe</option>
 <option value="GU">Guam</option>
 <option value="GT">Guatemala</option>
 <option value="GG">Guernsey</option>
 <option value="GN">Guinea</option>
 <option value="GW">Guinea-Bissau</option>
 <option value="GY">Guyana</option>
 <option value="HT">Haiti</option>
 <option value="HM">Heard Island and McDonald Islands</option>
 <option value="HN">Honduras</option>
 <option value="HK">Hong Kong SAR China</option>
 <option value="HU">Hungary</option>
 <option value="IS">Iceland</option>
 <option value="IN">India</option>
 <option value="ID">Indonesia</option>
 <option value="IR">Iran</option>
 <option value="IQ">Iraq</option>
 <option value="IE">Ireland</option>
 <option value="IM">Isle of Man</option>
 <option value="IL">Israel</option>
 <option value="IT">Italy</option>
 <option value="JM">Jamaica</option>
 <option value="JP">Japan</option>
 <option value="JE">Jersey</option>
 <option value="JO">Jordan</option>
 <option value="KZ">Kazakhstan</option>
 <option value="KE">Kenya</option>
 <option value="KI">Kiribati</option>
 <option value="KW">Kuwait</option>
 <option value="KG">Kyrgyzstan</option>
 <option value="LA">Laos</option>
 <option value="LV">Latvia</option>
 <option value="LB">Lebanon</option>
 <option value="LS">Lesotho</option>
 <option value="LR">Liberia</option>
 <option value="LY">Libya</option>
 <option value="LI">Liechtenstein</option>
 <option value="LT">Lithuania</option>
 <option value="LU">Luxembourg</option>
 <option value="MO">Macau SAR China</option>
 <option value="MK">Macedonia</option>
 <option value="MG">Madagascar</option>
 <option value="MW">Malawi</option>
 <option value="MY">Malaysia</option>
 <option value="MV">Maldives</option>
 <option value="ML">Mali</option>
 <option value="MT">Malta</option>
 <option value="MH">Marshall Islands</option>
 <option value="MQ">Martinique</option>
 <option value="MR">Mauritania</option>
 <option value="MU">Mauritius</option>
 <option value="YT">Mayotte</option>
 <option value="MX">Mexico</option>
 <option value="FM">Micronesia</option>
 <option value="MD">Moldova</option>
 <option value="MC">Monaco</option>
 <option value="MN">Mongolia</option>
 <option value="ME">Montenegro</option>
 <option value="MS">Montserrat</option>
 <option value="MA">Morocco</option>
 <option value="MZ">Mozambique</option>
 <option value="MM">Myanmar [Burma]</option>
 <option value="NA">Namibia</option>
 <option value="NR">Nauru</option>
 <option value="NP">Nepal</option>
 <option value="NL">Netherlands</option>
 <option value="AN">Netherlands Antilles</option>
 <option value="NC">New Caledonia</option>
 <option value="NZ">New Zealand</option>
 <option value="NI">Nicaragua</option>
 <option value="NE">Niger</option>
 <option value="NG">Nigeria</option>
 <option value="NU">Niue</option>
 <option value="NF">Norfolk Island</option>
 <option value="MP">Northern Mariana Islands</option>
 <option value="KP">North Korea</option>
 <option value="NO">Norway</option>
 <option value="OM">Oman</option>
 <option value="QO">Outlying Oceania</option>
 <option value="PK">Pakistan</option>
 <option value="PW">Palau</option>
 <option value="PS">Palestinian Territories</option>
 <option value="PA">Panama</option>
 <option value="PG">Papua New Guinea</option>
 <option value="PY">Paraguay</option>
 <option value="PE">Peru</option>
 <option value="PH">Philippines</option>
 <option value="PN">Pitcairn Islands</option>
 <option value="PL">Poland</option>
 <option value="PT">Portugal</option>
 <option value="PR">Puerto Rico</option>
 <option value="QA">Qatar</option>
 <option value="RE">Réunion</option>
 <option value="RO">Romania</option>
 <option value="RU">Russia</option>
 <option value="RW">Rwanda</option>
 <option value="BL">Saint Barthélemy</option>
 <option value="SH">Saint Helena</option>
 <option value="KN">Saint Kitts and Nevis</option>
 <option value="LC">Saint Lucia</option>
 <option value="MF">Saint Martin</option>
 <option value="PM">Saint Pierre and Miquelon</option>
 <option value="VC">Saint Vincent and the Grenadines</option>
 <option value="WS">Samoa</option>
 <option value="SM">San Marino</option>
 <option value="ST">São Tomé and Príncipe</option>
 <option value="SA">Saudi Arabia</option>
 <option value="SN">Senegal</option>
 <option value="RS">Serbia</option>
 <option value="CS">Serbia and Montenegro</option>
 <option value="SC">Seychelles</option>
 <option value="SL">Sierra Leone</option>
 <option value="SG">Singapore</option>
 <option value="SK">Slovakia</option>
 <option value="SI">Slovenia</option>
 <option value="SB">Solomon Islands</option>
 <option value="SO">Somalia</option>
 <option value="ZA">South Africa</option>
 <option value="GS">South Georgia and the South Sandwich Islands</option>
 <option value="KR">South Korea</option>
 <option value="ES">Spain</option>
 <option value="LK">Sri Lanka</option>
 <option value="SD">Sudan</option>
 <option value="SR">Suriname</option>
 <option value="SJ">Svalbard and Jan Mayen</option>
 <option value="SZ">Swaziland</option>
 <option value="SE">Sweden</option>
 <option value="CH">Switzerland</option>
 <option value="SY">Syria</option>
 <option value="TW">Taiwan</option>
 <option value="TJ">Tajikistan</option>
 <option value="TZ">Tanzania</option>
 <option value="TH">Thailand</option>
 <option value="TL">Timor-Leste</option>
 <option value="TG">Togo</option>
 <option value="TK">Tokelau</option>
 <option value="TO">Tonga</option>
 <option value="TT">Trinidad and Tobago</option>
 <option value="TN">Tunisia</option>
 <option value="TR">Turkey</option>
 <option value="TM">Turkmenistan</option>
 <option value="TC">Turks and Caicos Islands</option>
 <option value="TV">Tuvalu</option>
 <option value="UG">Uganda</option>
 <option value="UA">Ukraine</option>
 <option value="AE">United Arab Emirates</option>
 <option value="GB">United Kingdom</option>
 <option value="US">United States</option>
 <option value="ZZ">Unknown or Invalid Region</option>
 <option value="UY">Uruguay</option>
 <option value="UM">U.S. Minor Outlying Islands</option>
 <option value="VI">U.S. Virgin Islands</option>
 <option value="UZ">Uzbekistan</option>
 <option value="VU">Vanuatu</option>
 <option value="VA">Vatican City</option>
 <option value="VE">Venezuela</option>
 <option value="VN">Vietnam</option>
 <option value="WF">Wallis and Futuna</option>
 <option value="EH">Western Sahara</option>
 <option value="YE">Yemen</option>
 <option value="ZM">Zambia</option>
 <option value="ZW">Zimbabwe</option>

 */
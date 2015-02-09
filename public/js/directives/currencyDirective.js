/**
 * Created with JetBrains WebStorm.
 * User: hermenegildoromero
 * Date: 27/10/13
 * Time: 08:38
 * To change this template use File | Settings | File Templates.
 */

angular.module('currencySelect', [])
    .directive('currencySelect', ['$parse', function ($parse) {
        var currency = [
            "USD United States Dollars","EUR Euro","CAD Canada Dollars","GBP United Kingdom Pounds","DEM Germany Deutsche Marks","FRF France Francs","JPY Japan Yen","NLG Netherlands Guilders","ITL Italy Lira","CHF Switzerland Francs","DZD Algeria Dinars","ARP Argentina Pesos","AUD Australia Dollars","ATS Austria Schillings","BSD Bahamas Dollars","BBD Barbados Dollars","BEF Belgium Francs","BMD Bermuda Dollars","BRR Brazil Real","BGL Bulgaria Lev","CAD Canada Dollars","CLP Chile Pesos","CNY China Yuan Renmimbi","CYP Cyprus Pounds","CSK Czech Republic Koruna","DKK Denmark Kroner","NLG Dutch Guilders","XCD Eastern Caribbean Dollars","EGP Egypt Pounds","EUR Euro","FJD Fiji Dollars","FIM Finland Markka","FRF France Francs","DEM Germany Deutsche Marks","XAU Gold Ounces","GRD Greece Drachmas","HKD Hong Kong Dollars","HUF Hungary Forint","ISK Iceland Krona","INR India Rupees","IDR Indonesia Rupiah","IEP Ireland Punt","ILS Israel New Shekels","ITL Italy Lira","JMD Jamaica Dollars","JPY Japan Yen","JOD Jordan Dinar","KRW Korea (South) Won","LBP Lebanon Pounds","LUF Luxembourg Francs","MYR Malaysia Ringgit","MXP Mexico Pesos","NLG Netherlands Guilders","NZD New Zealand Dollars","NOK Norway Kroner","PKR Pakistan Rupees","XPD Palladium Ounces","PHP Philippines Pesos","XPT Platinum Ounces","PLZ Poland Zloty","PTE Portugal Escudo","ROL Romania Leu","RUR Russia Rubles","SAR Saudi Arabia Riyal","XAG Silver Ounces","SGD Singapore Dollars","SKK Slovakia Koruna","ZAR South Africa Rand","KRW South Korea Won","ESP Spain Pesetas","XDR Special Drawing Right (IMF)","SDD Sudan Dinar","SEK Sweden Krona","CHF Switzerland Francs","TWD Taiwan Dollars","THB Thailand Baht","TTD Trinidad and Tobago Dollars","TRL Turkey Lira","GBP United Kingdom Pounds","USD United States Dollars","VEB Venezuela Bolivar","ZMK Zambia Kwacha","EUR Euro","XCD Eastern Caribbean Dollars","XDR Special Drawing Right (IMF)","XAG Silver Ounces","XAU Gold Ounces","XPD Palladium Ounces","XPT Platinum Ounces"
        ];

        var currencyValue = [
            "USD","EUR","CAD","GBP","DEM","FRF","JPY","NLG","ITL","CHF","DZD","ARP","AUD","ATS","BSD","BBD","BEF","BMD","BRR","BGL","CAD","CLP","CNY","CYP","CSK","DKK","NLG","XCD","EGP","EUR","FJD","FIM","FRF","DEM","XAU","GRD","HKD","HUF","ISK","INR","IDR","IEP","ILS","ITL","JMD","JPY","JOD","KRW","LBP","LUF","MYR","MXP","NLG","NZD","NOK","PKR","XPD","PHP","XPT","PLZ","PTE","ROL","RUR","SAR","XAG","SGD","SKK","ZAR","KRW","ESP","XDR","SDD","SEK","CHF","TWD","THB","TTD","TRL","GBP","USD","VEB","ZMK","EUR","XCD","XDR","XAG","XAU","XPD","XPT"
        ];

        return {
            restrict: 'E',
            template: '<select><option>' + currency.join('</option><option>') + '</option></select>',
            replace: true,
            link: function (scope, elem, attrs) {
                if (!!attrs.ngModel) {
                    var assignCurrency = $parse(attrs.ngModel).assign;

                    elem.bind('change', function (e) {
                        assignCurrency(elem.val());
                    });

                    scope.$watch(attrs.ngModel, function (currency) {
                        elem.val(currency);
                    });
                }
            }
        };
    }]);

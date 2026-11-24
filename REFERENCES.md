# References

IEEE style. Numbers match the citations in the project report and [THEORY.md](THEORY.md). The notebook keeps its own shorter list of the sources it uses.

\[1\] S. Bhatt *et al.*, “The global distribution and burden of dengue,” *Nature*, vol. 496, no. 7446, pp. 504–507, 2013, doi: [10.1038/nature12060](https://doi.org/10.1038/nature12060).

\[2\] World Health Organization, “Dengue and severe dengue,” fact sheet. \[Online\]. Available: [who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue](https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue) (accessed Nov. 24, 2026).

\[3\] H. A. Tissera *et al.*, “Severe dengue epidemic, Sri Lanka, 2017,” *Emerging Infectious Diseases*, vol. 26, no. 4, pp. 682–691, 2020, doi: [10.3201/eid2604.190435](https://doi.org/10.3201/eid2604.190435).

\[4\] Epidemiology Unit, Ministry of Health, Sri Lanka, “Weekly Epidemiological Report,” 2017. \[Online\]. Available: [epid.gov.lk](https://www.epid.gov.lk). Compiled in T. S. Talagala, *denguedatahub: A Tidy Format Datasets of Dengue by Country*, R package v4.1.2. \[Online\]. Available: [github.com/thiyangt/denguedatahub](https://github.com/thiyangt/denguedatahub)

\[5\] Department of Census and Statistics, Sri Lanka, “Mid-year population estimates by district and sex, 2014–2024.” \[Online\]. Available: [statistics.gov.lk](https://www.statistics.gov.lk/Resource/en/Population/Vital_Statistics/Mid-year_population_by_district_and_sex_2014_2024.pdf)

\[6\] L. B. Carrington and C. P. Simmons, “Human to mosquito transmission of dengue viruses,” *Frontiers in Immunology*, vol. 5, art. no. 290, 2014, doi: [10.3389/fimmu.2014.00290](https://doi.org/10.3389/fimmu.2014.00290).

\[7\] R. C. Reiner Jr. *et al.*, “A systematic review of mathematical models of mosquito-borne pathogen transmission: 1970–2010,” *Journal of the Royal Society Interface*, vol. 10, no. 81, art. no. 20120921, 2013, doi: [10.1098/rsif.2012.0921](https://doi.org/10.1098/rsif.2012.0921).

\[8\] W. O. Kermack and A. G. McKendrick, “A contribution to the mathematical theory of epidemics,” *Proceedings of the Royal Society A*, vol. 115, pp. 700–721, 1927, doi: [10.1098/rspa.1927.0118](https://doi.org/10.1098/rspa.1927.0118).

\[9\] M. Andraud, N. Hens, C. Marais and P. Beutels, “Dynamic epidemiological models for dengue transmission: A systematic review of structural approaches,” *PLoS ONE*, vol. 7, no. 11, art. no. e49085, 2012, doi: [10.1371/journal.pone.0049085](https://doi.org/10.1371/journal.pone.0049085).

\[10\] L. Esteva and C. Vargas, “Analysis of a dengue disease transmission model,” *Mathematical Biosciences*, vol. 150, pp. 131–151, 1998, doi: [10.1016/S0025-5564(98)10003-2](https://doi.org/10.1016/S0025-5564(98)10003-2).

\[11\] G. P. Withanage, S. D. Viswakula, Y. I. Nilmini Silva Gunawardena and M. D. Hapugoda, “A forecasting model for dengue incidence in the District of Gampaha, Sri Lanka,” *Parasites & Vectors*, vol. 11, art. no. 262, 2018, doi: [10.1186/s13071-018-2828-2](https://doi.org/10.1186/s13071-018-2828-2).

\[12\] M. Oki, T. Sunahara, M. Hashizume and T. Yamamoto, “Optimal timing of insecticide fogging to minimize dengue cases: Modeling dengue transmission among various seasonalities and transmission intensities,” *PLoS Neglected Tropical Diseases*, vol. 5, no. 10, art. no. e1367, 2011, doi: [10.1371/journal.pntd.0001367](https://doi.org/10.1371/journal.pntd.0001367).

\[13\] S. Funk *et al.*, “Comparative analysis of dengue and Zika outbreaks reveals differences by setting and virus,” *PLoS Neglected Tropical Diseases*, vol. 10, no. 12, art. no. e0005173, 2016, doi: [10.1371/journal.pntd.0005173](https://doi.org/10.1371/journal.pntd.0005173).

\[14\] N. Metropolis, A. W. Rosenbluth, M. N. Rosenbluth, A. H. Teller and E. Teller, “Equation of state calculations by fast computing machines,” *Journal of Chemical Physics*, vol. 21, no. 6, pp. 1087–1092, 1953, doi: [10.1063/1.1699114](https://doi.org/10.1063/1.1699114).

\[15\] A. Gelman and D. B. Rubin, “Inference from iterative simulation using multiple sequences,” *Statistical Science*, vol. 7, no. 4, pp. 457–472, 1992, doi: [10.1214/ss/1177011136](https://doi.org/10.1214/ss/1177011136).

\[16\] G. O. Roberts, A. Gelman and W. R. Gilks, “Weak convergence and optimal scaling of random walk Metropolis algorithms,” *Annals of Applied Probability*, vol. 7, no. 1, pp. 110–120, 1997, doi: [10.1214/aoap/1034625254](https://doi.org/10.1214/aoap/1034625254).

\[17\] J. C. Butcher, *Numerical Methods for Ordinary Differential Equations*, 3rd ed. Chichester, U.K.: Wiley, 2016, doi: [10.1002/9781119121534](https://doi.org/10.1002/9781119121534).

\[18\] A. Gelman, J. B. Carlin, H. S. Stern, D. B. Dunson, A. Vehtari and D. B. Rubin, *Bayesian Data Analysis*, 3rd ed. Boca Raton, FL, USA: CRC Press, 2013.

## Where each reference is used

| Topic | References |
|---|---|
| Dengue burden and the 2017 Sri Lanka epidemic | [1], [2], [3] |
| Data: weekly cases and population | [4], [5] |
| Infectious period | [6] |
| Epidemic and dengue modelling | [7], [8], [9], [10], [11], [12], [13] |
| MCMC and convergence | [14], [15], [16], [18] |
| Numerical ODE solvers (RK4) | [17] |
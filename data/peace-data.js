/* =====================================================================
   PEACE Study — site data
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to:
     • add / update a participating country or coordinator  → sites
     • move a country between cultural blocks               → groups
     • publish enrollment numbers                           → groups[].n
     • add a study log entry                                → timeline
   Every entry has English (_en) and Traditional Chinese (_zh) fields.
   ===================================================================== */

window.PEACE_DATA = {

  /* Date shown as "Last updated" on the Data Hub and footer (YYYY-MM-DD) */
  updated: '2026-10-30',

  /* ---------------------------------------------------------------
     Country names (ISO 3166-1 alpha-2 codes, used for flags too)
     --------------------------------------------------------------- */
  countries: {
    tw: { en: 'Taiwan',         zh: '台灣' },
    kr: { en: 'South Korea',    zh: '南韓' },
    jp: { en: 'Japan',          zh: '日本' },
    sa: { en: 'Saudi Arabia',   zh: '沙烏地阿拉伯' },
    jo: { en: 'Jordan',         zh: '約旦' },
    gb: { en: 'United Kingdom', zh: '英國' },
    us: { en: 'United States',  zh: '美國' },
    au: { en: 'Australia',      zh: '澳洲' },
    ca: { en: 'Canada',         zh: '加拿大' },
    my: { en: 'Malaysia',       zh: '馬來西亞' },
    ch: { en: 'Switzerland',    zh: '瑞士' }
  },

  /* ---------------------------------------------------------------
     Cultural blocks
       countries : countries planned for this block
       target    : minimum valid responses
       n         : valid responses so far — leave null to keep counts
                   hidden (bar shows "counts released after Phase 2").
                   Only block-level totals are ever shown publicly.
     --------------------------------------------------------------- */
  groups: [
    { id: 'A', name_en: 'Confucian',       name_zh: '儒家文化圈', countries: ['tw', 'kr', 'jp'],       target: 300, n: null },
    { id: 'B', name_en: 'Middle Eastern',  name_zh: '中東文化圈', countries: ['sa', 'jo'],             target: 300, n: null },
    { id: 'C', name_en: 'Western Control', name_zh: '西方對照組', countries: ['gb', 'us', 'au', 'ca'], target: 300, n: null }
  ],

  /* ---------------------------------------------------------------
     Participating sites (one entry per lead person)
       role   : 'pi' (Co-Principal Investigator) | 'nc' (National Coordinator)
       Countries in a group with no entry here are listed on the
       Consortium page as open for a national coordinator.
       A country that is not listed in any group above appears under
       "Additional partner sites" on the Data Hub.
     --------------------------------------------------------------- */
  sites: [
    {
      country: 'tw', role: 'pi',
      name: 'Yu-Tung Chang, PhD',
      position_en: '', position_zh: '',
      dept_en: 'College of Health Technology', dept_zh: '健康科技學院',
      inst_en: 'National Taipei University of Nursing and Health Sciences', inst_zh: '國立臺北護理健康大學'
    },
    {
      country: 'sa', role: 'pi',
      name: 'Prof. Brett Williams, PhD, FACP',
      position_en: '', position_zh: '',
      dept_en: 'Department of Emergency Medical Care', dept_zh: '緊急醫療救護學系',
      inst_en: 'Imam Abdulrahman Bin Faisal University', inst_zh: '伊瑪目阿卜杜勒拉曼·本·費薩爾大學'
    },
    {
      country: 'au', role: 'nc',
      name: 'Kylie Kendrick',
      position_en: 'Registered Paramedic | Senior Lecturer in Paramedicine', position_zh: '註冊急救員 | 急救醫學資深講師',
      dept_en: 'School of Nursing, Midwifery and Paramedicine', dept_zh: '護理、助產與急救醫學學院',
      inst_en: 'Australian Catholic University', inst_zh: '澳洲天主教大學'
    },
    {
      country: 'jo', role: 'nc',
      name: 'Dr. Alaa Oteir, PhD',
      position_en: 'Associate Professor & Head of Allied Medical Sciences', position_zh: '副教授暨醫療輔助科學學系主任',
      dept_en: 'Faculty of Applied Medical Sciences', dept_zh: '應用醫療科學學院',
      inst_en: 'Jordan University of Science and Technology', inst_zh: '約旦科技大學'
    },
    {
      country: 'my', role: 'nc',
      name: 'Dr. Sarah Shaikh Abdul Karim, M.Med',
      position_en: 'Specialist, Emergency Medicine', position_zh: '急診醫學專科醫師',
      dept_en: 'Faculty of Medicine', dept_zh: '醫學院',
      inst_en: 'Management and Science University (MSU)', inst_zh: '管理與科學大學（MSU）'
    },
    {
      country: 'ch', role: 'nc',
      name: 'Sascha Janssen, MLS, MSc',
      position_en: 'Head of Emergency Medical Services', position_zh: '救護部門總負責人',
      dept_en: 'Rettungsdienst (Ambulance Service)', dept_zh: '救護部門（Rettungsdienst）',
      inst_en: 'Spital Thurgau AG', inst_zh: '圖爾高州立醫院集團（Spital Thurgau AG）'
    }
  ],

  /* ---------------------------------------------------------------
     Study log — newest first is NOT required, the page sorts by date.
       date : 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD'
       type : 'ethics' | 'site' | 'language' | 'recruitment' |
              'presentation' | 'publication'
       link : optional URL
     --------------------------------------------------------------- */
  timeline: [
    {
      date: '2026', type: 'ethics',
      text_en: 'Study protocol approved by the Institutional Review Board (ECKIRB1150308).',
      text_zh: '研究計畫通過人體研究倫理審查委員會核准（ECKIRB1150308）。'
    },
    {
      date: '2026', type: 'language',
      text_en: 'Survey available in five languages: English, Chinese, Japanese, Korean and Arabic.',
      text_zh: '問卷提供英文、中文、日文、韓文、阿拉伯文五種語言版本。'
    },
    {
      date: '2026-10-30', type: 'site',
      text_en: 'Switzerland joins the consortium — Sascha Janssen (Spital Thurgau AG) appointed National Coordinator.',
      text_zh: '瑞士加入研究聯盟，由 Sascha Janssen（Spital Thurgau AG）擔任國家協調人。'
    }
  ]
};

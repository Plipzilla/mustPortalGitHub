1
MALAWI UNIVERSITY OF SCIENCE AND TECHNOLOGY
MALAWI INSTITUTE OF TECHNOLOGY
Department of Computer Science and Information Technology
Business Information Technology
Research Proposal
E-admission: Online Portal for University Applicants

Contents
Introduction and Problem Statement ……………………………………… 3
 Introduction …………………………………………………………… 3
 Problem Statement …………………………………………………… 4
Research Aim. Objectives and Research Questions…………………………5
 Aim………………………………………………………………….……5
 Objectives ………………………………………………………….…...5
 Research Questions ……………………………………………….……5
Preliminary Literature Review…………………………………………….….6
Research Methodology …………………………………………………...….9
Ethical Considerations ……………………………………………………….12
Proposed Research Work Plan………………………………………………13
Research Limitations …………………………………………………......….14
Budget ………………………………………………………………………...14

3
1 Introduction and Problem Statement
1.1 Introduction
The higher education sector globally has increasingly adopted digital solutions to
streamline university admissions. These digital solutions have replaced traditional
paper-based and email-based systems with online application platforms that offer
efficiency, transparency, and scalability (Ngugi & Mwangi, 2020). Research has
demonstrated that online applications in universities have standardized application
procedures, decreased administrative burdens, and enhanced applicant experiences in
developed nations such as the United States and the United Kingdom (Garnett et al.,
2018). In a similar vein, several African nations, including South Africa and Kenya, have
also established online application portals at their universities. For instance, South
Africa's Central Application Clearing House (CACH) has increased transparency and
decreased administrative difficulties, while Kenya Universities and Colleges Central
Placement Services (KUCCPS) has made higher education more accessible to all
applicant levels, shortened processing times despite infrastructure issues, and offered
more equitable access.
To shed more light, online application platforms can offer multiple benefits to both the
applicant and the university.
Online platforms offer efficiency and speed as applications are rapidly submitted,
automatically reviewed, and processed. This reduces administrative delays (Ali & Awan,
2020). Administrators and applicants also receive real-time updates of information and
notifications, which ensure timely communication.
Online platforms are also capable of automatically validating data, which minimizes
human errors (Li & Miao, 2016), thus enhancing data integrity. The data is also stored
securely with regular backups to ensure availability.
The platforms also ease the process of tracking applicants because the platforms keep
the history of applicants, which simplifies the process of audits and ensures transparency
(Chawinga & Zozie, 2016).
In Malawi, the National Council for Higher Education (NCHE) has made significant
improvements with its online platform for undergraduates’ admissions to public
universities (Manda, 2018). NCHE is a centralized platform for matching applicants with
available places at higher education institutions, using the specific requirements for
admission of each institution. The platform, often requires applicants to create account,
select desired programs and institutions, and upload necessary supporting documents
like academic transcripts, ID copies, and other relevant documents. Despite the efforts,
email or physical form submissions continue to be relied upon by postgraduates,
economic, weekend, and Open Distance Learning (ODL) applicants when applying
directly to some institutions like Malawi University of Science and Technology (MUST)
and the University of Malawi (UNIMA). This fragmented process undermines the
benefits of digitalization and continues to cause inefficiencies.
This research proposes an online admission portal for universities like MUST designed
to meet the needs of these student groups who are not well-served by platforms such
as the NCHE application platform.
4
1.2 Problem Statement
Despite the proven benefits of online admission systems in various universities around
the world, most Malawian universities still depend on paper-based or email-based
methods for direct applicants to universities. For example, MUST’s current system
requires applicants to download PDF forms, print them, and submit via email or in
person. The current application process presents several challenges for both applicants
and administrators.
For example, for applicants, paper-based or email-based applications are inefficient,
time consuming, and have higher likelihood of human errors. These factors lead to
inefficiencies when it comes to completing forms and getting responses from the
institution they have applied to (Mwansa, 2017).
Applicants living in remote areas often face considerable financial strain when required
to travel to submit physical documents. Rural regions having limited infrastructure can
also factor the travel time and expenses. As Kumar and Patel (2021) note, these
challenges discourage participation and widen the gap in access to essential services.
On the other hand, administrators also face challenges of their own:
Firstly, paper-based applications often suffer from issues such as illegible handwriting
and correction difficulties. The administrator may misinterpret information due to
unclear hand writings which impede the accuracy of the admission process.
Additionally, relying on paper-based record-keeping can be time consuming and
inefficient information retrieval, which can cause administrative delays (Selwyn, 2014).
Secondly, these traditional admission methods require rigorous verification processes to
ensure authenticity and protect against forged documents (IAPP, 2023) or spam emails.
These verification processes are not easy, expensive, and slow.
Thirdly, paper forms and email attachments are vulnerable to loss, physical damage,
forgery, and unauthorized access (IAPP, 2023). These risks can compromise the
confidentiality of sensitive information, creating potential for exposure and
unauthorized access.
Lastly, paper files require storage facilities at the university which are expensive to
construct and ensure security. It implies that the facility must be restricted from
unauthorized access and free from physical damage risks such as fire or water.
By implementing a secure, user-friendly online admission portal that complies with
global best practices while considering the infrastructural and resource limitations of
Malawian universities, institutions can enhance application efficiency, increase
accessibility for prospective applicants, and align more closely with international
standards in higher education (Garcia & Lee, 2021).
5
2 Research Aim, Objectives, and Research Questions
2.1 Aim
The aim of this research is to design an online student application system that economic
students, ODL scholars, weekend students and postgraduates can use to apply directly
to universities in Malawi, as a solution to the problems that are brought by paper-based
or email-based application methods.
2.2 Objectives
This research has the following specific objectives:
a) To analyse challenges associated with paper-based or email-based direct
admission process of economic and postgraduate students to universities.
b) To determine prominent features and functionalities of the university’s online
platform.
c) To design and implement an online platform that allows students to easily
submit their applications, personal details and track their progress.
d) To evaluate the usability of the prototype to determine how easily, efficiently,
and satisfactorily users can interact with its features and perform intended tasks.
2.3 Research Questions
The research has the following corresponding questions:
a) What are the key challenges faced by economic and postgraduate students, and
universities in the paper-based or email-based direct admission process?
b) What are the most prominent features and functionalities of the university’s
online admission platform for economic students and postgraduates applying
directly to a university?
c) How can an online platform be designed and implemented to enable students
to easily submit their applications, provide personal details, and track their
application progress effectively?
d) How usable is the prototype in terms of ease of use, efficiency, and user
satisfaction when interacting with its features and completing intended tasks.
6
3 Preliminary Literature Review
3.1 Context
The adoption of online application platforms in higher education has revolutionized
the way students apply to universities, offering efficiency, transparency, and accessibility
(Ngugi & Mwangi, 2020). Online application platforms have streamlined processes by
automating submissions, verification of documents, and real-time tracking (Garnett et
al., 2018). This literature review synthesizes existing research on online application
systems, focusing on their benefits, challenges, and implications for Malawian
universities.
3.2 Benefits of online application systems
3.2.1 Reducing processing time and improving efficiency
Online application systems have significantly reduced the time required to process
applications compared to traditional paper-based or email methods. According to
Alenezi (2018), digital systems eliminate many manual tasks that typically delay
admission processes. The automation of document verification, data entry, and
preliminary qualification checks accelerates the entire workflow. Universities with high
application volumes particularly benefit from this efficiency, as it reduces administrative
burden and allows staff to focus on more complex evaluation tasks rather than
paperwork (Garnett et al., 2018)
3.2.2 Improved data accuracy and validation during processing
Paper-based applications often suffer from issues such as missing information and
illegible handwriting. Chen (2020) highlights that online systems reduce these errors by
implementing automatic validation processes that ensure all required fields are
completed correctly before submission. Digital forms can enforce data format
requirements, preventing common mistakes such as incorrectly formatted dates or
contact information. Studies by Kumar & Patel (2021) found that structured digital
forms reduce application errors by over 80% compared to handwritten submissions,
significantly improving data quality for administrative decision-making.
3.2.3 Real-time tracking and communication between applicants and
administrative
Online application systems enable applicants to track the status of their applications in
real time. According to Sharma & Moyi (2019), this transparency builds trust between
applicants and institutions, as applicants can see exactly where their application stands
in the process. Modern platforms integrate automated communication systems that
send timely notifications about missing documents, upcoming deadlines, and admission
decisions. This improved communication is particularly valuable in contexts like
Malawi, where applicants using traditional methods often experience significant delays
in receiving updates about their application status (Kanyundo, 2021).
7
3.2.4 Improved accessibility for a global audience
Digital application platforms eliminate geographical barriers, allowing students from
distant locations to apply without traveling to the institution. Williams et al. (2022)
note that this accessibility is particularly important for reaching underserved populations
and international applicants. Institutions implementing comprehensive online
application systems typically experience increases in application diversity and volume.
The removal of physical submission requirements particularly benefits applicants from
rural areas who would otherwise need to travel long distances to submit documents
(Chirwa, 2016). For Malawian universities seeking to attract students from neighbouring
countries, this accessibility represents a significant advantage.
3.2.5 Cost reduction
The transition to online applications generates substantial cost savings for both
institutions and applicants. Universities reduce expenses associated with printing,
physical storage, and manual processing of paper applications. According to Osman
(2020), higher education institutions implementing fully digital admissions processes
report operational cost reductions of 30-45% compared to traditional systems. For
applicants, digital submission eliminates expenses related to printing, photocopying,
and transportation to the institution. These savings are particularly significant in the
Malawian context, where economic constraints affect both institutional budgets and
student resources (Manda, 2018).
3.2.6 Information security and confidentiality
Modern online application platforms offer superior security features compared to paper
documents or unsecured email attachments. Digital systems implement encryption,
secure authentication, and controlled access to protect sensitive applicant information
(International Association of Privacy Professionals, 2023). This enhanced security helps
universities comply with emerging data protection regulations while reducing risks of
unauthorized access or document loss. In the context of Malawian universities, where
paper documents may be vulnerable to physical damage or misplacement, digital
systems provide important safeguards for applicant data integrity and confidentiality.
8
3.3 Current State in Malawi and Regional Context
In Malawi, the National Council for Higher Education (NCHE) has introduced a
centralized online admission system for public universities, reducing reliance on email
and paper-based applications for undergraduate admissions (Manda, 2018). However,
this platform does not serve all applicant categories, specifically Postgraduate,
economic, weekend, and ODL who apply directly to universities. Current research
shows that only Lilongwe University of Agriculture and Natural Resources (LUANAR)
utilises online admissions platforms (https://luanar.ac.mw/pgapps/new_use_form.php)
while most of the universities such as MUST, Kamuzu University of Health Sciences
(KUHES), University of Malawi (UNIMA), Mzuzu University (MZUNI) and Catholic
University (CU) are still using traditional methods for admitting students applying
directly to their institutions.
These traditional methods either require applicants to download forms from university
websites, fill them manually, and mail them to the institution, or require applicants to
physically visit campuses to obtain and submit forms. For example, a call for application
for ODEL applicants at UNIMA for the 2025-2026 academic year requires applicants
to download application form in PDF format. The applicants are supposed to submit
their applications physically which is an ordinary way.
https://unima.ac.mw/announcements
Similar practices are observed in neighbouring countries like Zambia and Zimbabwe,
where some universities continue to rely on paper-based or email-based methods for
specific student categories (Mwansa, 2017). This fragmented approach undermines the
benefits of digitalization and perpetuates inefficiencies in the admissions process.
The absence of comprehensive digital systems creates challenges for non-traditional
applicants. Postgraduate, economic, weekend, and ODL students often face additional
barriers in the application process, including limited information about program
requirements, difficulties in submitting required documentation, and delays in receiving
admission decisions (Chawinga & Zozie, 2016). These challenges are worsened for
applicants from rural areas or those with limited access to transportation, who must
overcome significant logistical obstacles to complete paper-based applications.
3.4 Theoretical Frameworks and Future Directions
The literature suggests that online application platforms have significant potential to
improve admission processes in Malawian universities, but successful implementation
requires careful attention to context-specific challenges. Garcia & Lee (2021) emphasize
the importance of designing systems that accommodate local infrastructure limitations,
address digital literacy barriers, and incorporate appropriate security measures. This
context-sensitive approach is essential for developing platforms that are truly accessible
to all potential applicants.
9
Despite the transformative potential of online application platforms, persistent
challenges remain in ensuring technical reliability, maintaining robust security, and
optimizing user experience. Brink et al. (2019) highlight the importance of user-friendly
design approaches that consider the needs and capabilities of diverse applicant
populations. By incorporating input from potential users throughout the development
process, universities can create platforms that are both technically sound and usable in
the Malawian context.
The literature clearly demonstrates the value and necessity of transitioning from
traditional paper-based and email-based admission systems to comprehensive online
platforms. By addressing the specific needs and challenges of the Malawian higher
education context, particularly for postgraduate, economic, weekend, and ODL
applicants, this research aims to contribute to the ongoing digital transformation of
university admission processes. The development of a tailored online admission portal
has the potential to enhance accessibility, efficiency, and equity in higher education,
benefiting both institutions and applicants.
4 Research Methodology
This study adopts the Constructive Research Methodology (CRM), which is designed
for developing and evaluating innovative, practical solutions to real-world problems.
It is particularly suitable for this project, which seeks to design, implement, and evaluate
an online application platform to improve the admission process for economic,
postgraduate, ODL, and weekend students in Malawian universities. CRM provides a
structured, step-by-step approach that combines academic rigor with solution-oriented
development.
4.1 Problem Identification
To analyse challenges associated with the paper-based or email-based direct admission
process and to understand the core challenges within the current admission systems.
4.2 Understanding the problem and Theoretical Background
The following qualitative and quantitative data collection methods will be conducted:
● Structured questionnaires (administered via Google Forms) will be distributed to
university staff, IT personnel, and students to gather quantitative data on the
drawback of the current system.
● Semi-structured interviews will be conducted with admissions officers and
applicants to gather a deeper understanding of issues and unmet needs.
● Document analysis will review application procedures used by universities like
LUANAR, and Catholic University (CU).
● Case studies of successful platforms such as UCAS (UK) will be analysed to extract
best practices in online admissions.
10
4.3 Design of the Artifact
The design phase of the online platform will be conducted through the use a functional
prototype using Figma, to show the intended user interface, navigation flows, and form
layouts. User-centred design principles will also be considered to incorporate insights
from earlier data collection and address the identified pain points.
4.4 Development of the Artifact
The development phase will make use of the agile software development model to
guide the process across two-week sprints, with each sprint focusing on building and
refining one feature of the platform (e.g., sprint 1 for account creation and sprint 2 for
document upload).
Daily standups, whereby the development team meets daily to discuss progress and
roadblocks, is another key practice that is emphasised using the agile model. The use of
the agile model will provide retrospectives after each sprint, allowing the team to
review what worked and what did not work to improve the next sprint. The adaptive
nature of the agile development model also ensures that the project team remains
flexible when faced with challenges and roadblocks.
The development of the platform features will be divided into sprints in the following
manner:
Sprint 1: User Onboarding:
● Account registration/ login
● User profile setup
● Basic database structure
Sprint 2: Application Workflow:
● Application form
● Program selection
● Draft/saving/submit logic
Sprint 3: Document and Payment Modules:
● File upload (PDF, image formats)
● Payment gateway integration
● Confirmation emails
Sprint 4: Tracking, Admin and Communication:
● Application status tracking
● Admin dashboard (viewing/managing applications)
● Email notifications and ticketing system
11
The development of the platform will be built using:
● Laravel, a PHP framework used to develop secure and scalable backends.
● React.js, to build a responsive and modular frontend.
● SSL encryption, to ensure secure communication, and that the system complies
with Malawi’s Data Protection Act (2021).
● Third party API integration, to enable SMS notification and real time updates.
4.5 Demonstration of the Artifact
To demonstrate how the proposed solution meets its intended purpose; a pilot version
of the platform will be shared with a selected group of students and university staff.
Participants will be asked to simulate key tasks such as account creation, document
upload, and application tracking. Observation and participant’s user feedback will help
confirm usability and completeness of features before full development is finalized.
4.6 Evaluation of the Artifact
To evaluate the usability and effectiveness of the prototype, the following tests will be
conducted:
● System Usability Scale (SUS): A standard survey instrument that will be used to
measure the overall user satisfaction and the ease of use.
● Task-Based Testing: Whereby participants will perform tasks while researchers
measure metrics such as the time taken to complete tasks, faced error rates, and
task completion rates.
● Load Testing: The platform will be evaluated under simulated high-traffic
conditions to accurately assess the stability and performance of the platform.
● Qualitative Feedback: Open-ended responses will be collected from users
regarding their experience as well as any suggestions for improvement.
● Security Testing: Vulnerability scans and manual checks will be conducted to
assess the extent to which the system protects sensitive data.
4.7 Research Contribution
The online platform will offer a replicable model for digital university admissions in
Malawi and offer a prototype that can be scaled to match the requirements of multiple
universities. It will also contribute to existing literature by providing additional data on
digital adoption in Malawian universities, while further supporting the digitization of
higher education institutions.
12
5 Ethical Considerations
During the development and implementation of the platform the following ethical
issues will be addressed:
● Data Privacy and Security
● Bias and Fairness
● Transparency and Accountability
● Accessibility and Inclusivity
The platform will manage sensitive information such as academic records, personal
identification details, and financial data submitted by applicants. To protect this
information, strong security measures like encryption and secure storage will be
implemented. Ensuring data privacy is crucial to building trust with applicants, especially
when they share personal details for university admissions.
The platform will ensure that algorithms used for processing applications are free from
biasness related to race, religion, gender, socioeconomic status, or geographic location.
For example, applicants from underprivileged backgrounds or underrepresented
communities should not face disadvantages in the evaluation process. Regular audits
will be conducted to identify and address any biases (Mehrabi et al, 2021), ensuring
equal opportunities for all applicants.
Applicants will have a clear understanding of how their data is used and how decisions
are made during the application process. The platform will provide detailed
information about evaluation criteria, the role of automated systems, and the steps
involved in decision-making. Additionally, a grievance redressal mechanism will be
available for applicants to appeal decisions or raise concerns, ensuring accountability.
The admissions platform will be designed to accommodate applicants with diverse
needs, including those with disabilities or limited access to technology. Features like
screen reader compatibility, simple navigation, and support for multiple languages will
ensure that applicants from all backgrounds can use the platform easily. This inclusivity
is essential to ensure that no one is excluded from the opportunity to apply to
universities.
13
6 Proposed Research Work Plan
The proposed timelines for the research are given in the table below:
ACTIVITY DATE
DURATION
(working days)
Proposal development 04 March – 18 April 45 days
System Requirement Gathering
and Analysis
05 May – 18 May 14 days
System Designing 19 May – 08 June 21 days
System Development 09 June – 05 August 58 days
System Testing 06 August – 26 August 21 days
System Evaluation 27 August – 09 September 14 days
Dissertation Write Up 10 September – 23 September 14 days
Dissertation submission 24 September - 30 September 7 days
14
7 Research Limitations
In the research phase, one major challenge is limited access to data, making it difficult
to gather accurate information about user needs, system requirements, and competitor
platforms. Since the focus will be implementing a system for an individual university,
we may not be able to take into consideration other universities’ courses and
requirements. Biasness in data collection can further hinder research accuracy, as surveys
and interviews may not represent all needed information.
The platform is required to work via the internet, so the platform cannot be accessed
in certain areas where there is no to little internet access. This plays as a challenge
because it means that the effort to try and eliminate the current manual method difficult
because of students who do not have internet access.
Budget constraints, often pose as a major challenge. Developing and maintaining a
sophisticated online application platform requires significant financial investment,
which may not always be available. Limited budgets can restrict access to advanced tool
and technologies, potentially leading to compromises in the platform's quality or
functionality.
Data privacy and security. The platform will collect and store sensitive applicant
information, such as personal details, academic records, and payment data. Protecting
this data from breaches or unauthorized access is critical, so too compliance with
regulations like Malawi’s Data Protections Act. Failure to address these concerns can
lead to legal repercussions and loss of trust among applicants.
Time constraints can hinder the ability to gather meaningful insights. Conducting
thorough research on user behaviour, platform performance, or applicant needs often
requires considerable time, which may conflict with tight development deadlines.
Rushing the research process can lead to incomplete or inaccurate data, resulting in
poor decision-making during development.
Finally, digital access and literacy barriers among students will be a challenge because
like previously mentioned, not everyone has reliable internet access, and some
applicants may also lack the skills or familiarity required to navigate the online
application process effectively.
8 Budget
The budget has been drafted based on the following facts and assumptions.
i. Facts to consider
a) The team consists of eight members.
b) The development methodology follows an iterative approach, with key
phases including requirements gathering, design, development, testing, and
deployment to a testing environment.
c) The project aims to create a functional prototype, demonstrating core
features of a university online application platform.
15
ii. Assumptions
a) The project will be conducted over a period of 5 months.
b) Team members will utilize their personal computing equipment and software
development tools.
c) Communication and collaboration will primarily occur through online
platforms, including WhatsApp, Google Meet and Zoom.
d) Each team member is expected to contribute an average of 10 hours per week
to the project.
e) User feedback will be gathered through online surveys and virtual usability
testing sessions with a representative group of target users.
f) To ensure the platform meets the needs of its users, each team member will
be responsible for gathering requirements by interviewing a representative
from the university's admissions office, current students, or prospective
applicants.
g) Each team member will conduct a usability test with a potential user of the
platform, such as a prospective student, a current student, or a member of
the university's admissions staff, to evaluate the platform's ease of use and
identify areas for improvement.


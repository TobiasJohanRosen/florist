import WebTestBase
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
class InformationTest(WebTestBase.BaseTest):

    # Tests if website contains address information
    def test_address_found(self):
        driver = self.driver
        driver.get(self.WEBSITE_URL)
        address = "Fjällgatan 32H\n981 39 KIRUNA"

        try:
            driver.find_element(By.PARTIAL_LINK_TEXT, address)
        except NoSuchElementException:
            self.fail("No address found")


    # Tests if website contains opening hours
    def test_opening_hours_found(self):
        driver = self.driver
        driver.get(self.WEBSITE_URL)

        open_hours = [
            'Vardagar 10-16',
            'Lördagar 12-15',
            'Söndagar Stängt'
        ]

        opening_hours_elems = driver.find_elements(By.CLASS_NAME, "opening-hour")

        if(len(opening_hours_elems) > 0):
            for index in range(len(opening_hours_elems)):
                open_hour_spans = opening_hours_elems[index].find_elements(By.TAG_NAME, "span")
                open_hour_text = open_hour_spans[0].text + " " +  open_hour_spans[1].text

                if(index >= len(open_hours)):
                    index = index - len(open_hours)
                    self.assertIn(open_hour_text, open_hours[index])
                else:
                    self.assertIn(open_hour_text, open_hours[index])
        else:
            self.fail("No opening hours found")

    # Tests if website contains email and phonenumber
    def test_email_and_phonenumber_found(self):
        driver = self.driver
        driver.get(self.WEBSITE_URL)

        email = "info@the-travelling-salesmen.gitlab.io"
        phonenumber = "0630-555-555"

        try:
            driver.find_element(By.PARTIAL_LINK_TEXT, email)
        except NoSuchElementException:
            self.fail("No email found")

        try:
            driver.find_element(By.PARTIAL_LINK_TEXT, phonenumber)
        except NoSuchElementException:
            self.fail("No phonenumber found")

    # Tests if the website contains a <h1 class="title">
    # with the text "Välkommen till Floristgården!"
    def test_text_exist(self):
        validText = "Välkommen till Floristgården!"
        driver = self.driver
        driver.get(self.WEBSITE_URL)
        elem = driver.find_element(By.CLASS_NAME, "display-4")
        self.assertIn(validText, elem.text)

    # Tests if the title of the website contains "Floristgården"
    def test_title_exist(self):
        driver = self.driver
        driver.get(self.WEBSITE_URL)
        validTitle = "Floristgården"
        self.assertIn(validTitle, driver.title)

    def test_blomgram_title_exist(self):
        driver = self.driver
        driver.get(self.WEBSITE_URL)
        validBlomTitle = "Vill du ha blommor hemskickade till någon du håller nära. Det fixar vi!"
        elem = driver.find_element(By.CLASS_NAME, "blomTitle")
        self.assertIn(validBlomTitle, elem.text)

    def test_blomgram_exist(self):
        driver = self.driver
        driver.get(self.WEBSITE_URL)
        validInfo = "Befinner du dig i Kiruna? Då kan vi skicka blommor hem till dig!\nRing 0630-555-555 för att beställa och betala sedan med faktura.\nOsäker om vi levererar till ditt område? Testa genom att skriv in postnummer nedan.\nÖvriga frågor: Ring 0630-555-555"
        elem = driver.find_element(By.CLASS_NAME, "blomInfo")
        self.assertIn(validInfo, elem.text)

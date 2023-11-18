// ** MUI Imports
import FirstSection from 'src/views/pages/home/firstSection'
import SecondSection from 'src/views/pages/home/secondSection'
import CardSection from 'src/views/pages/home/cardSection'

const Home = () => {
  return (
    <>
      <FirstSection />
      <SecondSection />
      <CardSection />
    </>
  )
}
Home.guestGuard = true

export default Home

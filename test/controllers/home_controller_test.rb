require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get pomodoro" do
    get home_pomodoro_url
    assert_response :success
  end
end

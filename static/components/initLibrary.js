import showHideSecondaryWindow from "../JS/SecondaryWindow.js";
import misc from "../JS/misc.js";

export default function initLibrary(libraryName) {
    let libraryLocation = {latitude: 0.0, longitude: 0.0};
    showHideSecondaryWindow("تكوين المكتبة", `
            <!--TODO: add Access Checkbox -->
             <div class="container" style="width:700px">
                <form id="uploadForm" enctype="multipart/form-data" action="/createLibrary/${misc.ID}" method="post">
                <div class="row">
                    <!-- Right Side -->
                    <div class="col-4 p-3" id="createLibrary_rightSide" style="width: 32%">
                        <!-- Library Cover -->
                        <img src="assets/libraryLogo.png" class="rounded pt-2" alt="createLibrary_Cover" height="180px" 
                            width="100%" id="createLibrary_Cover" style="background-color: var(--App-panelBorderColor);filter: grayscale(100%)">
                        <!-- Library Cover Button -->
                        <a class="btn rounded border mt-2 pt-2" href="#" id="createLibrary_browse_cover"
                            style="background-color: var(--App-panelBorderColor);color: var(--App-navTextColor);display: block">
                        اختر ملف<i class="fa-solid fa-file-import me-2"></i>
                            <input class="form-control" name="CL_Cover" type="file" style="display:none" id="createLibrary_browse_cover_input" accept=".png,.jpg">
                        </a>
                    </div>
                    <!-- Main Section -->
                    <div class="mainSide col-8 rounded p-3 mt-3 pt-4" 
                        style="background-color: var(--App-panelBorderColor);display: block;height: 100%;">
                        <!-- Library Name -->
                        <div class="container">
                            <div class="row align-items-start">
                                <div class="mb-3 col">
                                    <input type="text" class="form-control required" name="CL_Name" id="createLibrary_Name" placeholder="اسم المكتبة" value="${libraryName}">
                                </div>
                            </div>
                        </div>
                        <!-- Library Location -->
                        <div class="container" dir="ltr">
                            <div class="row align-items-start">
                                <div class="mb-3 col">
                                        <div class="input-group">
                                            <span class="input-group-text cursorBt" id="createLibrary_LocationBt" title="تحديد مكانك"><i class="fas fa-location-crosshairs"></i></span>
                                            <input type="text" class="form-control" name="CL_Location" id="createLibrary_Location" title="اكتب عنوانك نصا" placeholder="عنوان المكتبة" style="text-align: right">
                                        </div>
                                </div>
                            </div>
                        </div>
                         <!-- Library Type and Currency -->
                        <div class="container">
                            <div class="row align-items-start">
                                <!-- Library type -->
                                <div class="mb-3 col">
                                    <select class="form-select" name="CL_Type" id="createLibrary_type" required>
                                        <option class="option" selected disabled>نوع المكتبة</option>
                                        <option value="person">فردي</option>
                                        <option value="organization">مؤسسة</option>
                                    </select>
                                </div>
                                <!-- Currency -->
                                <div class="mb-3 col">
                                    <select class="form-select" name="CL_Currency" id="createLibrary_currency" required>
                                        <option disabled selected class="text-muted">تحديد العملة</option>
                                        <option value="EGP">جنيه مصري (ج.م)</option>
                                        <option value="AED">درهم إماراتي (د.إ)</option>
                                        <option value="SAR">ريال سعودي (ر.س)</option>
                                        <option value="KWD">دينار كويتي (د.ك)</option>
                                        <option value="BHD">دينار بحريني (.د.ب)</option>
                                        <option value="OMR">ريال عماني (﷼)</option>
                                        <option value="JOD">دينار أُرْدُنّيّ (د.أ)</option>
                                        <option value="LBP">ليرة لبنانية (ل.ل)</option>
                                        <option value="SYP">ليرة سورية (ل.س)</option>
                                        <option value="IQD">دينار عراقي (ع.د)</option>
                                        <option value="MRU">أوقية موريتانية (أ.م)</option>
                                    </select>
                                </div>
                            </div>
                        </div>                      
                        <!-- About Library -->
                        <div class="container">
                            <div class="row align-items-start">
                                <div class="col">
                                    <textarea id="createLibrary_About" name="CL_About" class="form-control" rows="1" placeholder="نبذة عن المكتبة" style="font-size: 16px;"></textarea>
                                </div>
                            </div>
                        </div>
                        <!-- Social Media Links -->
                        <div class="container mt-2" dir="ltr">
                            <div class="row">
                                <div class="col offset-md-3">
                                    <div class="social-box">
                                        <!-- Website -->
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fas fa-globe"></i></span>
                                            <input type="text" class="form-control" name="CL_SM_website" placeholder="Website URL">
                                        </div>
                                        <!-- Twitter -->
                                        <div class="input-group mt-2">
                                            <span class="input-group-text"><i class="fab fa-twitter"></i></span>
                                            <input type="text" class="form-control" name="CL_SM_twitter" placeholder="Twitter URL">
                                        </div>
                                        <!-- Facebook -->
                                        <div class="input-group mt-2">
                                            <span class="input-group-text"><i class="fab fa-facebook"></i></span>
                                            <input type="text" class="form-control" name="CL_SM_facebook" placeholder="Facebook URL">
                                        </div>
                                        <!-- Instagram -->
                                        <div class="input-group mt-2">
                                            <span class="input-group-text"><i class="fab fa-instagram"></i></span>
                                            <input type="text" class="form-control" name="CL_SM_instagram" placeholder="Instagram URL">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </form>
            </div>
        `, "تكوين");
    /* Get Location Button */
    document.getElementById('createLibrary_LocationBt').addEventListener('click', async function () {
        try {
            libraryLocation = await misc.getUserLocation();
            // Send Data to Server
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'CL_GIS';
            hiddenInput.value = `${libraryLocation.latitude},${libraryLocation.longitude}`;
            document.getElementById("uploadForm").append(hiddenInput);
            document.getElementById("createLibrary_Location").placeholder = `${libraryLocation.latitude} , ${libraryLocation.longitude}`;
        } catch (error) {
            console.log(error.message);
        }
    });
    /* Get Cover Button */
    document.getElementById("createLibrary_browse_cover").onclick = () => {
        document.getElementById("createLibrary_browse_cover_input").click();
        /*TODO: load cover to window */
        document.getElementById("createLibrary_browse_cover_input").onchange = (evt) => {
            const cover = evt.target.files[0];
            if (cover) {
                document.getElementById("createLibrary_rightSide").firstChild.src = URL.createObjectURL(cover);
            }
        }
    }
    /* Create Library Button */
    //TODO: put some checks on posted data
    document.getElementById("SecondaryWindowBt_").onclick = () => {
        let spinner = document.createElement("span");
        spinner.className = "loader";
        spinner.style.marginTop = "50px";
        spinner.style.marginRight = "30%";
        document.getElementById("createLibrary_rightSide").append(spinner);
        setTimeout(() => {
            /*TODO: Loading Message or sign or gif */
            misc.postData(`editConfig/${misc.ID}/`, {
                newlibrary: false
            }).then((res) => {
                if (res) {
                    console.log(res);
                    // Clear Screen
                    while (mainView.firstChild) {
                        // Remove each child element
                        mainView.removeChild(mainView.firstChild);
                    }
                    document.getElementById("uploadForm").submit();
                }
            }).catch(error => {
                console.error('Error:', error);
            });
        }, 2000);
    }
}
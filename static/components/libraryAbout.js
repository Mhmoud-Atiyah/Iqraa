import misc from "../JS/misc.js";

export default function libraryAbout(LibraryData) {
    return `
<div style="height: 200px; width: 400px;font-family: Moharram, serif;margin-bottom: 120px">
   <div class="LibraryInfoCover">
      <img src="https://www.airtasker.com/blog/wp-content/uploads/2021/01/home-library-colours.jpg" alt="" class="pt-2" height="120px" width="94%" style="position: relative;right: 2%">
   </div>
   <div class="LibraryInfoData">
      <div class="container">
         <!-- title -->
         <div class="row pt-2">
            <div class="d-flex align-items-center" style="height: 30px">
               <i class="fas fa-building-columns ms-2 mt-1"></i>
               <span style="font-size: 28px;">مكتبة ${LibraryData.title.slice(0, 40)}</span>
            </div>
         </div>
         <!-- Created at -->
         <div class="row pt-1">
            <div class="d-flex align-items-center" style="height: 30px">
               <i class="fas fa-calendar ms-2"></i>
               <span style="font-size: 24px;">أنشئت في ${misc.convertToArabicNumeral(LibraryData.created_at.slice(0, 10))}</span>
            </div>
         </div>
         <!-- Location -->
         <div class="row">
            <div class="col d-flex align-items-center" style="height: 30px">
               <i class="fas fa-earth ms-2 mt-2"></i>
               <span style="font-size: 28px;">${LibraryData.location.slice(0, 40)}</span>
            </div>
         </div>
         <!-- Library Id -->
         <div class="row pt-1">
            <div class="d-flex align-items-center" style="height: 30px">
               <i class="fas fa-fingerprint ms-2 mt-1"></i>
               <input type="text" class="form-control" value="${LibraryData.id}" aria-describedby="copy-libraryId-key" readonly="" dir="ltr" style="height: 26px;width: 94%;">
            </div>
         </div>
         <!-- Social Media -->
         <div class="row pt-3">
            <div class="col d-flex align-items-center" style="height: 30px;margin-right: 75px">
               <div class="row">
                  <!-- Google Maps -->
                  <a class="col rounded pt-1 aboutIcon" href="https://www.google.com/maps/@${LibraryData.latitude},${LibraryData.longitude},15z" target="_blank"><i class="fas fa-map"></i></a>
                  <!-- Website -->
                  <a class="col rounded pt-1 aboutIcon" href="${LibraryData.socialmedia[0]}" target="_blank"><i class="fas fa-globe"></i></a>
                  <!-- Twitter -->
                  <a class="col rounded pt-1 aboutIcon" href="${LibraryData.socialmedia[1]}" target="_blank"><i class="fa-brands fa-twitter"></i></a>
                  <!-- Facebook -->
                  <a class="col rounded pt-1 aboutIcon" href="${LibraryData.socialmedia[2]}" target="_blank"><i class="fa-brands fa-facebook"></i></a>
                  <!-- Instagram -->
                  <a class="col rounded pt-1 aboutIcon" href="${LibraryData.socialmedia[3]}" target="_blank"><i class="fa-brands fa-instagram"></i></a>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
`;
    ;
}
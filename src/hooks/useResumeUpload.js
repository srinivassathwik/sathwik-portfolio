import { supabase } from "../lib/supabaseClient";
import { saveSetting } from "../lib/siteSettings";

export async function uploadResume(file) {

    if (!file) {
        throw new Error("No file selected.");
    }

    if (file.type !== "application/pdf") {
        throw new Error("Only PDF files are allowed.");
    }

    const path = "resume/resume.pdf";

    const { error } = await supabase.storage
        .from("site-assets")
        .upload(path, file, {
            upsert: true,
            contentType: "application/pdf"
        });

    if (error) {
        throw error;
    }

    const { data } = supabase.storage
        .from("site-assets")
        .getPublicUrl(path);

    const { error: saveError } = await saveSetting(
        "hero_resume_url",
        data.publicUrl
    );

    if (saveError) {
        throw saveError;
    }

    if (error) {
        throw error;
    }

    return data.publicUrl;
}